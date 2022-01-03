import {
  createParamDecorator,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { AccountsService } from './accounts/accounts.service';
import { AccountsController } from './accounts/accounts.controller';
import { EncryptionService } from './encryption.service';
import * as config from '../config.json';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationMiddleware } from './authentication.middleware';
import { AppService } from './app.service';
import { LunaModule } from './luna/luna.module';

@Module({
  imports: [
    KnexModule.forRoot(
      {
        config: {
          client: 'pg',
          connection: config.database,
        },
      },
      'luna-pass',
    ),
    JwtModule.registerAsync({ useFactory: () => ({ secret: config.secret }) }),
    LunaModule,
  ],
  controllers: [AccountsController],
  providers: [
    AppService,
    AccountsService,
    EncryptionService,
    // { provide: 'CONFIG', useValue: config },
    { provide: 'SECRET', useValue: config.secret },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthenticationMiddleware).forRoutes('api/accounts');
  }
}
