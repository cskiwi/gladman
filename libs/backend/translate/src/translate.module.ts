import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { TranslateController } from './controllers';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TranslateController],
  imports: [
    ConfigModule,
    I18nModule.forRootAsync({
      imports: [],
      resolvers: [{ use: QueryResolver, options: ['lang'] }],

      useFactory: () => {
        const apiDistFolderPath = join(process.cwd(), 'dist/apps/api');

        return {
          fallbackLanguage: 'nl_BE',
          loaderOptions: {
            path: join(apiDistFolderPath, `./assets/i18n/`),
            // watch: true,
          },
          typesOutputPath: join(process.cwd(), 'libs/i18n/src/lib/i18n.generated.ts'),
        };
      },
    }),
  ],
  exports: [],
})
export class TranslateModule {}
