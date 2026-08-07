import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { url } from 'inspector/promises';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3000);
  // const url = await app.getUrl();
  app.enableCors({
    origin: true, // Allows requests from any origin during development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const port = process.env.PORT || process.env.APP_PORT || 3000;
  await app.listen(port);
  
  // Clean NestJS-formatted log:
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
