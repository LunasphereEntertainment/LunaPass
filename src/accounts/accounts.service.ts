import { Injectable } from '@nestjs/common';
import { InjectKnex } from 'nestjs-knex';
import knex, { Knex } from 'knex';
import { Account } from './account.model';

@Injectable()
export class AccountsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  listAccounts(owner_id: number) {
    return this.knex('accounts')
      .select('id', 'username', 'url')
      .where({ owner_id });
  }

  getAccount(accountId: number, owner_id: number) {
    return this.knex('accounts').where({ id: accountId, owner_id }).first();
  }

  createAccount(
    owner_id: number,
    username: string,
    password: string,
    url: string,
  ) {
    return this.knex('accounts')
      .insert({ owner_id, username, password, url })
      .returning('id');
  }

  updateAccount(
    accountId: number,
    owner_id: number,
    username: string,
    password: string,
    url: string,
  ) {
    return this.knex('accounts')
      .update({ username, password, url })
      .where({ id: accountId, owner_id });
  }

  deleteAccount(accountId: number, owner_id: number) {
    return this.knex('accounts').where({ id: accountId, owner_id }).del();
  }
}
