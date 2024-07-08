import 'dotenv/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
/* import AppDataSource from './dataSource';

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    bootstrap();
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
    process.exit(1);
  });
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 4000;
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
