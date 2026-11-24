import { TranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { ITranslateConfig } from './interfaces';
import { RestartTolerantTranslateHttpLoader } from './restart-tolerant-translate-http-loader';

export const provideTranslation = (config: ITranslateConfig) => ({
  fallbackLang: 'en',
  lang: 'en',
  loader: [
    ...provideTranslateHttpLoader({
      prefix: `${config.api}`,
      suffix: '',
    }),
    { provide: TranslateLoader, useClass: RestartTolerantTranslateHttpLoader },
  ],
});
