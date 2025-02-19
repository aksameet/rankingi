// auth.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-custom-auth'];

    if (token !== 'YOUR_SECRET_TOKEN') {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}
