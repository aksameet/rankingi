import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:4200', 'https://rankingi-34df6.web.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.init();
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(() => {
    server.listen(3000, () => {
      console.log('NestJS server is running locally on http://localhost:3000');
    });
  });
} else {
  bootstrap();
}

export const api = functions.https.onRequest(server);
