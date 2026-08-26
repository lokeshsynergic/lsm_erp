import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

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
  //const configService = app.get(ConfigService);
  //const mapsKey = configService.get<string>('GOOGLE_MAPS_API_KEY');

  // console.log('Current Working Dir:', process.cwd());
  // console.log('Loaded API Key via ConfigService:', mapsKey);
  // console.log('Loaded API Key via process.env:', process.env.GOOGLE_MAPS_API_KEY);
  await app.listen(port);
  var pass = bcrypt.hashSync('admin', 10);
  console.log(pass);
  
  // Clean NestJS-formatted log:
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
