import { DestroyRef, EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

/**
 * Keeps PrimeNG's built-in aria labels (e.g. toast close buttons) in sync with the active app language.
 */
export function providePrimeNgAriaTranslations(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const translate = inject(TranslateService);
    const primeng = inject(PrimeNG);

    translate
      .stream('all.button.close')
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((close: string) => primeng.setTranslation({ aria: { ...primeng.translation.aria, close } }));
  });
}
