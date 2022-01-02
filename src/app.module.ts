import { createParamDecorator, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nestjs-knex';
import { AccountsService } from './accounts/accounts.service';
import { AccountsController } from './accounts/accounts.controller';
import { EncryptionService } from './encryption.service';
import * as config from '../config.json';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationMiddleware } from "./authentication.middleware";
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: config.database,
      },
    }),
    JwtModule.registerAsync({ useFactory: () => ({ secret: config.secret }) }),
  ],
  controllers: [AppController, AccountsController, AuthController],
  providers: [
    AppService,
    AccountsService,
    EncryptionService,
    { provide: 'CONFIG', useValue: config },
    AuthService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthenticationMiddleware).forRoutes('accounts');
  }
}
