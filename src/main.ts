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
  const configService = new ConfigService();
  const port = configService.get('PORT') || 3000;
  const logger = new Logger('bootstrap');

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);

  logger.log(`Starting server on port ${port}`);
}
bootstrap();
