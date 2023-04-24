import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
// import { config } from 'dotenv';
// config({
//   path: __dirname + '/../.env',
//   debug: true,
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow('APP_PORT');
  await app.listen(port);

  const logger = new Logger('bootstrap');
  logger.log(`Starting server on port ${port}`);
}
bootstrap();
