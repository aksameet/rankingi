import {
  Controller,
  Post,
  Body,
  Response,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body, @Response() res) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
    const jwt = await this.authService.login(user);
    res.cookie('jwt', jwt.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000, // 1 hour
    });
    return res.status(HttpStatus.OK).json({ message: 'Login successful' });
  }

  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('jwt');
    return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }

  @Get('status')
  async status(@Response() res) {
    const token = res.req.cookies['jwt'];
    if (!token) {
      return res.status(HttpStatus.OK).json({ authenticated: false });
    }
    try {
      const payload = await this.authService.verifyToken(token);
      return res
        .status(HttpStatus.OK)
        .json({ authenticated: true, user: payload });
    } catch (error) {
      return res.status(HttpStatus.OK).json({ authenticated: false });
    }
  }
}
