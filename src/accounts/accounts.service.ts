import { Injectable } from '@nestjs/common';
import { InjectKnex } from 'nestjs-knex';
import knex, { Knex } from 'knex';
import { Account } from './account.model';

@Injectable()
export class AccountsService {
  constructor(@InjectKnex('luna-pass') private readonly knex: Knex) {}

  listAccounts(owner_id: number) {
    return this.knex('accounts')
      .select('id', 'name', 'username', 'url')
      .where({ owner_id })
      .orderBy('name', 'asc');
  }

  getAccount(accountId: number, owner_id: number) {
    return this.knex('accounts').where({ id: accountId, owner_id }).first();
  }

  createAccount(
    owner_id: number,
    name: string,
    username: string,
    password: string,
    url: string,
  ) {
    return this.knex('accounts')
      .insert({ owner_id, name, username, password, url })
      .returning('id');
  }

  updateAccount(
    accountId: number,
    owner_id: number,
    name: string,
    username: string,
    password: string,
    url: string,
  ) {
    return this.knex('accounts')
      .update({ name, username, password, url })
      .where({ id: accountId, owner_id });
  }

  deleteAccount(accountId: number, owner_id: number) {
    return this.knex('accounts').where({ id: accountId, owner_id }).del();
  }
}
