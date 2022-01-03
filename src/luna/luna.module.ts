import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { KnexModule } from 'nestjs-knex';
import { luna, secret } from '../../config.json';
import { AuthController } from './auth/auth.controller';
import { EncryptionService } from '../encryption.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    KnexModule.forRoot(
      {
        config: {
          client: 'pg',
          connection: luna.database,
        },
      },
      'luna-services',
    ),
    JwtModule.registerAsync({ useFactory: () => ({ secret: secret }) }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EncryptionService,
    { provide: 'SECRET', useValue: secret },
  ],
  // exports: [AuthController, AuthService]
})
export class LunaModule {}
