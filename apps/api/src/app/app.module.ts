import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerLibModule } from '@noloback/logger-lib';
import { TranslatorLibModule } from '@noloback/translator-lib';
import { UsersControllerModule } from '@noloback/users.controller';
import { AuthControllerModule } from '@noloback/auth.controller';
import { RegisterModule } from '@noloback/register.controller';
import { CountriesControllerModule } from '@noloback/countries.controller';
import { DepartmentsControllerModule } from '@noloback/departments.controller';
import { CitiesControllerModule } from '@noloback/cities.controller';
import { AddressesControllerModule } from '@noloback/addresses.controller';

@Module({
  imports: [
    AuthControllerModule,
    LoggerLibModule,
    TranslatorLibModule,
    UsersControllerModule,
    RegisterModule,
    CountriesControllerModule,
    DepartmentsControllerModule,
    CitiesControllerModule,
    AddressesControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
