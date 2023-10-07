import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthLibModule } from '@no-lo-back/auth-lib';
import { LoggerLibModule } from '@no-lo-back/logger-lib';
import { TranslatorLibModule } from '@no-lo-back/translator-lib';
import { UsersLibModule } from '@no-lo-back/users-lib';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
