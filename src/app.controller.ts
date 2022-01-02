import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EncryptionService } from './encryption.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private encryption: EncryptionService,
  ) {}

  @Get('test')
  encryptionTest(): string {
    const testIn = 'test data',
      encrypted = this.encryption.encrypt(testIn),
      decrypted = this.encryption.decrypt(encrypted);

    return `HELLO WORLD\nEncrypting '${testIn}' => ${encrypted}\nDecrypting... '${decrypted}'`;
  }
}
