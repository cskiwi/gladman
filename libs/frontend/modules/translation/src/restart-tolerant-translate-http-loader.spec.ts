import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateLoader } from '@ngx-translate/core';
import { provideTranslation } from './translate.module';

describe('translation requests during API restarts', () => {
  let loader: TranslateLoader;
  let http: HttpTestingController;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ...provideTranslation({ api: '/api/v1/translate/i18n/' }).loader],
    });
    loader = TestBed.inject(TranslateLoader);
    http = TestBed.inject(HttpTestingController);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    http.verify();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('waits through proxy and network failures, then returns the real translations', () => {
    const onTranslation = jest.fn();
    const onError = jest.fn();
    loader.getTranslation('nl_BE').subscribe({ next: onTranslation, error: onError });

    for (const status of [502, 503, 504, 0]) {
      const request = http.expectOne('/api/v1/translate/i18n/nl_BE');
      if (status === 0) {
        request.error(new ProgressEvent('error'));
      } else {
        request.flush(null, { status, statusText: 'API unavailable' });
      }
      http.expectNone('/api/v1/translate/i18n/nl_BE');
      jest.advanceTimersByTime(1000);
    }
    const translations = { all: { button: { close: 'Sluiten' } } };
    http.expectOne('/api/v1/translate/i18n/nl_BE').flush(translations);

    expect(onTranslation).toHaveBeenCalledWith(translations);
    expect(onError).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it.each([401, 404, 500])('does not retry a permanent HTTP %s failure', (status: number) => {
    const onError = jest.fn();
    loader.getTranslation('en').subscribe({ error: onError });
    http.expectOne('/api/v1/translate/i18n/en').flush(null, { status, statusText: 'Failed' });

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status }));
    http.expectNone('/api/v1/translate/i18n/en');
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('stops after 30 retries and propagates the failure without empty translations', () => {
    const onTranslation = jest.fn();
    const onError = jest.fn();
    loader.getTranslation('en').subscribe({ next: onTranslation, error: onError });

    for (let attempt = 0; attempt <= 30; attempt++) {
      http.expectOne('/api/v1/translate/i18n/en').flush(null, { status: 502, statusText: 'Bad Gateway' });
      if (attempt < 30) {
        jest.advanceTimersByTime(1000);
      }
    }

    expect(onTranslation).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.any(HttpErrorResponse));
    expect(onError.mock.calls[0][0].status).toBe(502);
    jest.advanceTimersByTime(1000);
    http.expectNone('/api/v1/translate/i18n/en');
  });
});
