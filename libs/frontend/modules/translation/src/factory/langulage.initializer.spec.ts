import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { throwError } from 'rxjs';
import { langulageInitializer } from './langulage.initializer';

describe('translation initialization failures', () => {
  it('rejects initialization rather than rendering a successfully initialized page without translations', async () => {
    const error = new Error('Translation retries exhausted');
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: { addLangs: jest.fn(), use: () => throwError(() => error) } },
        { provide: SsrCookieService, useValue: { get: () => 'nl_BE', set: jest.fn() } },
      ],
    });

    try {
      const initialize = langulageInitializer(TestBed.inject(TranslateService), TestBed.inject(SsrCookieService));
      await expect(initialize()).rejects.toBe(error);
      expect(log).toHaveBeenCalledWith('Failed to initialize translations', error);
    } finally {
      log.mockRestore();
    }
  });
});
