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
import { LocationsControllerModule } from '@noloback/locations.controller';
import { ObjectCategoriesControllerModule } from '@noloback/object.categories.controller';
import { ObjectTypesControllerModule } from '@noloback/object.types.controller';

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
    LocationsControllerModule,
    ObjectCategoriesControllerModule,
    ObjectTypesControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
