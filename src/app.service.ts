import { Injectable } from '@nestjs/common';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { EncryptionService } from './encryption.service';

@Injectable()
export class AppService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private encryption: EncryptionService,
  ) {
    const initJobs = [
      knex.schema.createTableIfNotExists('accounts', (table) => {
        table.bigInteger('owner_id');
        table.increments('id');
        table.string('username');
        table.string('password');
        table.string('url');

        // table.primary(['ownerId', 'id']);
        // table.index(['id']);
      }),
      // knex.schema.createTableIfNotExists()
    ];
    Promise.all(initJobs)
      .then(() => {
        console.info('Database Init Completed.');
      })
      .catch((err) => {
        console.error('Database Init Failed! - ', err);
      });
  }
}