import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express'; // Might be different for Firebase Functions, might cause errors
import * as functions from 'firebase-functions';
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

// *** //
// For local development (when running `npm run start`)
if (process.env.NODE_ENV !== 'production') {
  createNestServer().then(() => {
    server.listen(3000, () => {
      console.log('NestJS server is running locally on http://localhost:3000');
    });
  });
}

export const api = functions.https.onRequest(server);
