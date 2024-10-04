import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https'; // Use the 2nd gen https trigger
import { ValidationPipe } from '@nestjs/common';

const server = express();

async function createNestServer() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: ['http://localhost:4200', 'https://rankingi-34df6.web.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
}

createNestServer();

// 2nd gen function trigger
export const api = onRequest({ cors: true }, server);
