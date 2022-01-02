import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from './encryption.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private encryption: EncryptionService,
  ) {}

  use(req: any, res: any, next: () => void) {
    let jwt = req.headers['authorization'];

    if (jwt) {
      jwt = jwt.replace('Bearer ', '');
    }

    const isAuthenticated = jwt ? this.jwtService.verify(jwt) : false;

    if (isAuthenticated) {
      req.user = this.jwtService.decode(jwt);
      if (req.user.pKey) req.secret = this.encryption.decrypt(req.user.pKey);
      next();
    } else {
      throw new UnauthorizedException(
        'User account JWT token missing or invalid.',
      );
    }
  }
}
