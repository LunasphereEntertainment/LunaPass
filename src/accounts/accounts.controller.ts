import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './account.model';
import { EncryptionService } from '../encryption.service';

@Controller('api/accounts')
export class AccountsController {
  constructor(
    private service: AccountsService,
    private encryption: EncryptionService,
  ) {}

  @Get('list')
  async listAccounts(@Req() req) {
    console.log('User', req.user);

    const accListing = await this.service.listAccounts(req.user.userId);

    return accListing.map(
      (acc) => new Account(acc.id, acc.name, acc.username, null, acc.url),
    );
  }

  @Get('/:accountId')
  async getAccountDetails(@Param('accountId') accountId: number, @Req() req) {
    const acc = await this.service.getAccount(accountId, req.user.userId);

    if (acc) {
      return new Account(acc.id, acc.name, acc.username, acc.password, acc.url);
    } else {
      throw new NotFoundException('Account with that ID could not be found!');
    }
  }

  @Post('new')
  async createAccount(
    @Body('name') name: string,
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('url') url: string,
    @Req() req,
  ) {
    const genIds = await this.service.createAccount(
      req.user.userId,
      name,
      username,
      this.encryption.encrypt(password),
      url,
    );

    if (genIds.length > 0) {
      return new Account(genIds[0], username, password, url);
    } else {
      throw new InternalServerErrorException(
        'Auto Increment ID not returned from the database.',
      );
    }
  }

  @Put(':id')
  async updateAccount(
    @Param('id') accountId: number,
    @Body('name') name: string,
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('url') url: string,
    @Req() req,
  ) {
    const result = await this.service.updateAccount(
      accountId,
      req.user.userId,
      name,
      username,
      this.encryption.encrypt(password),
      url,
    );
    if (result) {
      return null;
    } else {
      throw new NotFoundException('Requested account could not be updated!');
    }
  }

  @Delete(':id')
  async deleteAccount(@Param('id') accountId: number, @Req() req) {
    const result = await this.service.deleteAccount(accountId, req.user.userId);
    if (result) {
      return null;
    } else {
      throw new NotFoundException('Account with that ID could not be found!');
    }
  }
}
