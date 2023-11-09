import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthLibModule } from '@noloback/auth-lib';
import { LoggerLibModule } from '@noloback/logger-lib';
import { TranslatorLibModule } from '@noloback/translator-lib';
import { UsersControllerModule } from '@noloback/users-controller';

@Module({
  imports: [
    AuthLibModule,
    LoggerLibModule,
    TranslatorLibModule,
    UsersControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
