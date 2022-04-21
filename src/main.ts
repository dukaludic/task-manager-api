import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import express from 'express';
import * as bodyParser from 'body-parser';
import { config } from 'aws-sdk';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';

async function bootstrap() {
  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser(), bodyParser({ limit: '50mb' }));
  await app.listen(3000);
}
bootstrap();
