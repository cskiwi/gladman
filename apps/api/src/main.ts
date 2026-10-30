import { Logger } from '@nestjs/common';

import { createWinstonLogger, getServer } from '@apps/shared';

async function bootstrap() {
  const app = await getServer();
  const port = process.env.PORT || 5000;
  const logger = createWinstonLogger({ name: 'api', logDir: 'logs' });
  app.useLogger(logger);

  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
