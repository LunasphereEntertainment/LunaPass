import { Injectable } from '@nestjs/common';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { randomBytes } from 'crypto';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(@InjectKnex() private knex: Knex) {}

  private genSalt(length: number) {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0, length); /** return required number of characters */
  }

  private hashPassword(password: string, salt?: string) {
    return hash(`${password}${salt || this.genSalt(12)}`);
  }

  private verifyPassword(hashed: string, password: string, salt: string) {
    return verify(hashed, `${password}${salt || this.genSalt(12)}`);
  }

  async login(username: string, password: string) {
    const user = await this.knex('users').where({ username }).first();

    if (user) {
      const result = await this.verifyPassword(
        user.password,
        password,
        user.salt,
      );

      if (result) {
        return user;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
