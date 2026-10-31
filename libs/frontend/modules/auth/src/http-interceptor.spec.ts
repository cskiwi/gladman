import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { of, throwError } from 'rxjs';
import { AuthInterceptor } from '../interceptor/src/http-interceptor';

describe('AuthInterceptor GraphQL request diagnostics', () => {
  let log: jest.SpyInstance;
  const cookie = { check: jest.fn(), get: jest.fn() };

  beforeEach(() => {
    cookie.check.mockReturnValue(true);
    cookie.get.mockReturnValue('secret-token');
    TestBed.configureTestingModule({
      providers: [AuthInterceptor, { provide: PLATFORM_ID, useValue: 'server' }, { provide: SsrCookieService, useValue: cookie }],
    });
    log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function intercept(request: HttpRequest<unknown>, handler: HttpHandler) {
    return TestBed.runInInjectionContext(() => TestBed.inject(AuthInterceptor).intercept(request, handler));
  }

  it('logs the original network cause without credentials and preserves the error', () => {
    const cause = Object.assign(new Error('sensitive transport message'), {
      code: 'ECONNREFUSED',
      syscall: 'connect',
      address: '127.0.0.1',
      port: 5000,
    });
    const url = 'http://localhost:5000/graphql';
    const error = new HttpErrorResponse({
      url,
      status: 0,
      error: Object.assign(new TypeError('fetch failed'), { cause }),
    });
    const request = new HttpRequest('POST', url, {
      operationName: 'Profile',
      variables: { token: 'secret-variable' },
    });
    const handler = {
      handle: jest.fn((outgoing: HttpRequest<unknown>) => {
        expect(outgoing.headers.get('Authorization')).toBe('Bearer secret-token');
        return throwError(() => error);
      }),
    };
    const onError = jest.fn();

    intercept(request, handler).subscribe({ error: onError });

    expect(onError).toHaveBeenCalledWith(error);
    expect(log).toHaveBeenCalledTimes(1);
    expect(JSON.parse(log.mock.calls[0][1])).toMatchObject({
      operationName: 'Profile',
      url: 'http://localhost:5000/graphql',
      method: 'POST',
      platform: 'server',
      hasAuthCookie: true,
      status: 0,
      causes: [{ name: 'TypeError' }, { name: 'Error', code: 'ECONNREFUSED', address: '127.0.0.1', port: 5000 }],
    });
    expect(log.mock.calls[0][1]).not.toMatch(/secret-token|secret-variable|sensitive transport message/);
  });

  it('does not log successful Profile requests or change their response', () => {
    const response = new HttpResponse({ body: { data: { me: null } } });
    const next = jest.fn();

    intercept(new HttpRequest('POST', '/graphql', { operationName: 'Profile' }), {
      handle: () => of(response),
    }).subscribe(next);

    expect(next).toHaveBeenCalledWith(response);
    expect(log).not.toHaveBeenCalled();
  });

  it('logs failures for other named GraphQL operations', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const onError = jest.fn();

    intercept(new HttpRequest('POST', '/graphql', { operationName: 'OtherQuery' }), {
      handle: () => throwError(() => error),
    }).subscribe({ error: onError });

    expect(onError).toHaveBeenCalledWith(error);
    expect(JSON.parse(log.mock.calls[0][1])).toMatchObject({ operationName: 'OtherQuery', status: 500 });
  });

  it('logs failures for unnamed GraphQL queries', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const onError = jest.fn();

    intercept(new HttpRequest('POST', '/graphql', { query: '{ me { id } }' }), {
      handle: () => throwError(() => error),
    }).subscribe({ error: onError });

    expect(onError).toHaveBeenCalledWith(error);
    expect(JSON.parse(log.mock.calls[0][1])).toMatchObject({ operationName: '<anonymous>', status: 500 });
  });

  it('does not log unrelated HTTP failures', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const onError = jest.fn();

    intercept(new HttpRequest('GET', '/api/v1/example'), {
      handle: () => throwError(() => error),
    }).subscribe({ error: onError });

    expect(onError).toHaveBeenCalledWith(error);
    expect(log).not.toHaveBeenCalled();
  });

  it('logs browser failures without requiring an auth cookie', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' });
    cookie.check.mockReturnValue(false);
    const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    const request = new HttpRequest('POST', '/graphql', { operationName: 'Profile' });
    const handler = { handle: jest.fn(() => throwError(() => error)) };

    intercept(request, handler).subscribe({ error: () => undefined });

    expect(handler.handle).toHaveBeenCalledWith(request);
    expect(JSON.parse(log.mock.calls[0][1])).toMatchObject({
      platform: 'browser',
      hasAuthCookie: false,
      status: 401,
      statusText: 'Unauthorized',
    });
  });
});
