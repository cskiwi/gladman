import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AUTH_KEY } from '@app/frontend-modules-auth/service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    const cookie = inject(SsrCookieService);
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    const hasAuthCookie = cookie.check(AUTH_KEY);
    if (hasAuthCookie) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${cookie.get(AUTH_KEY)}`,
        },
      });
    }
    return next.handle(request).pipe(
      tap({
        error: (error: unknown) => {
          const body = request.body;
          if (
            !body ||
            typeof body !== 'object' ||
            !(('query' in body && typeof body.query === 'string') || ('operationName' in body && typeof body.operationName === 'string'))
          ) {
            return;
          }

          // Apollo converts HttpErrorResponse to Error, discarding the fetch failure's cause.
          const causes: Record<string, string | number>[] = [];
          let cause: unknown = error instanceof HttpErrorResponse ? error.error : error;
          for (let depth = 0; depth < 5 && cause && typeof cause === 'object'; depth++) {
            const details: Record<string, string | number> = {};
            for (const key of ['name', 'code', 'errno', 'syscall', 'address', 'port']) {
              if (key in cause) {
                const value: unknown = Reflect.get(cause, key);
                if (typeof value === 'string' || typeof value === 'number') {
                  details[key] = value;
                }
              }
            }
            causes.push(details);
            cause = 'cause' in cause ? cause.cause : undefined;
          }

          console.error(
            'GraphQL HTTP request failed:',
            JSON.stringify({
              operationName: 'operationName' in body && typeof body.operationName === 'string' ? body.operationName : '<anonymous>',
              url: request.url.split('?')[0],
              method: request.method,
              platform: isBrowser ? 'browser' : 'server',
              hasAuthCookie,
              status: error instanceof HttpErrorResponse ? error.status : undefined,
              statusText: error instanceof HttpErrorResponse ? error.statusText : undefined,
              causes,
            }),
          );
        },
      }),
    );
  }
}
