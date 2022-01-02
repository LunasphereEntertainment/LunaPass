import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { EncryptionService } from '../encryption.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
  constructor(
    private encryption: EncryptionService,
    private service: AuthService,
    private jwt: JwtService,
  ) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const result = await this.service.login(username, password);
    if (result) {
      return this.jwt.sign({
        userId: result.user_id,
        username: result.username,
        pKey: this.encryption.encrypt(result.password),
      });
    } else {
      throw new UnauthorizedException(
        'Username or password is incorrect. Please try again.',
      );
    }
  }
}
