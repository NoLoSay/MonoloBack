import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerLibModule } from '@noloback/logger-lib';
import { TranslatorLibModule } from '@noloback/translator-lib';
import { UsersControllerModule } from '@noloback/users.controller';
import { AuthControllerModule } from '@noloback/auth.controller';
import { RegisterModule } from '@noloback/register.controller';
import { CountriesControllerModule } from '@noloback/countries.controller';

@Module({
  imports: [
    AuthControllerModule,
    LoggerLibModule,
    TranslatorLibModule,
    UsersControllerModule,
    RegisterModule,
    CountriesControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
