import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { TranslateModule } from './translate.module';

jest.mock('./controllers', () => ({
  TranslateController: class {},
}));

jest.mock('nestjs-i18n', () => ({
  ...jest.requireActual('nestjs-i18n'),
  I18nModule: {
    forRootAsync: jest.fn(() => ({})),
  },
}));

describe('TranslateModule', () => {
  it('generates translation types into the library consumed by the API', async () => {
    expect(TranslateModule).toBeDefined();
    const options = jest.mocked(I18nModule.forRootAsync).mock.calls[0][0];
    if (!options.useFactory) {
      throw new Error('Expected translation options to use a factory.');
    }
    const actualOptions = await options.useFactory();

    expect(actualOptions.typesOutputPath).toBe(join(process.cwd(), 'libs/i18n/src/lib/i18n.generated.ts'));
    expect(actualOptions.fallbackLanguage).toBe('nl_BE');
    expect(actualOptions.loaderOptions.path).toBe(join(process.cwd(), 'dist/apps/api/assets/i18n/'));
  });
});
