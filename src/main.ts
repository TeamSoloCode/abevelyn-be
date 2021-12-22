import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  app.enableCors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  });
  // app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  await app.listen(3000);
}
bootstrap();
