import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bcrypt from 'bcrypt';
import { join } from 'path'; // Standard path import for all OS platforms

async function bootstrap() {
  // Pass NestExpressApplication generic so TypeScript recognizes useStaticAssets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const uploadDir = join(__dirname,'..', 'uploads');
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads',
  });

  const port = process.env.PORT || process.env.APP_PORT || 3000;
  await app.listen(port);

  const pass = bcrypt.hashSync('admin', 10);
  console.log(pass);

  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();