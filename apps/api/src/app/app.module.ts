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
import { ItemCategoriesControllerModule } from '@noloback/item.categories.controller';
import { ItemTypesControllerModule } from '@noloback/item.types.controller';
import { PersonsControllerModule } from '@noloback/persons.controller';
import { ItemsControllerModule } from '@noloback/items.controller';
import { ExhibitionsControllerModule } from '@noloback/exhibitions.controller';
import { VideoControllerModule } from '@noloback/video.controller';
import { SearchControllerModule } from '@noloback/search.controller';
import { ProfileControllerModule } from '@noloback/profile.controller';

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
    ItemCategoriesControllerModule,
    ItemTypesControllerModule,
    PersonsControllerModule,
    ItemsControllerModule,
    ExhibitionsControllerModule,
    VideoControllerModule,
    SearchControllerModule,
    ProfileControllerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
