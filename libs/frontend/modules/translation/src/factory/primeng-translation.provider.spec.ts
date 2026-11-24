import { createEnvironmentInjector, EnvironmentInjector, ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { Subject } from 'rxjs';
import { providePrimeNgAriaTranslations } from './primeng-translation.provider';

describe('PrimeNG translation errors', () => {
  it('reports a failed translation stream without throwing an unhandled RxJS error', () => {
    const translations = new Subject<string>();
    const handleError = jest.fn();
    const setTranslation = jest.fn();
    const error = new Error('Translation API unavailable');
    const injector = createEnvironmentInjector(
      [
        { provide: TranslateService, useValue: { stream: () => translations } },
        { provide: PrimeNG, useValue: { translation: { aria: { close: 'Close' } }, setTranslation } },
        { provide: ErrorHandler, useValue: { handleError } },
        providePrimeNgAriaTranslations(),
      ],
      TestBed.inject(EnvironmentInjector),
    );

    try {
      translations.error(error);

      expect(handleError).toHaveBeenCalledWith(error);
      expect(setTranslation).not.toHaveBeenCalled();
    } finally {
      injector.destroy();
    }
  });
});
