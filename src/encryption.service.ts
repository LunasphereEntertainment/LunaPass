import { Inject, Injectable } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly secret: string;

  constructor(@Inject('CONFIG') private config: any) {
    this.secret = config.secret;
  }

  private _getKey(secret?: string) {
    return createHash('sha256')
      .update(secret || this.secret)
      .digest('base64')
      .substr(0, 32);
  }

  encrypt(data: string, secret?: string) {
    const iv = randomBytes(10);

    const cipher = createCipheriv('aes-256-gcm', this._getKey(secret), iv);

    const encrypted = cipher.update(data, 'utf8', 'hex'),
      final = cipher.final(),
      authTag = cipher.getAuthTag();

    return `${iv.toString('base64')},${authTag.toString('hex')},${encrypted}`;
  }

  decrypt(data: string, secret?: string) {
    const [ivBase64, authTag, encrypted] = data.split(',');
    const iv = Buffer.from(ivBase64, 'base64');

    const decipher = createDecipheriv('aes-256-gcm', this._getKey(secret), iv);

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    return Buffer.concat([
      decipher.update(encrypted, 'hex'),
      decipher.final(),
    ]).toString('utf8');
  }
}
