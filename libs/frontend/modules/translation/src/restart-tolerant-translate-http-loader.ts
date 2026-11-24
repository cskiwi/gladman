import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslationObject } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, retry, throwError, timer } from 'rxjs';

const TRANSLATION_RETRY_COUNT = 30;
const TRANSLATION_RETRY_DELAY_MS = 1000;

@Injectable()
export class RestartTolerantTranslateHttpLoader extends TranslateHttpLoader {
  /** Waits for temporary API downtime without masking permanent translation errors. */
  override getTranslation(lang: string): Observable<TranslationObject> {
    return super.getTranslation(lang).pipe(
      retry({
        count: TRANSLATION_RETRY_COUNT,
        delay: (error: unknown, retryCount: number) => {
          if (!(error instanceof HttpErrorResponse) || ![0, 502, 503, 504].includes(error.status)) {
            return throwError(() => error);
          }
          if (retryCount === 1) {
            console.warn('Translation API temporarily unavailable; retrying for up to 30 seconds.', {
              language: lang,
              status: error.status,
            });
          }
          return timer(TRANSLATION_RETRY_DELAY_MS);
        },
      }),
    );
  }
}
