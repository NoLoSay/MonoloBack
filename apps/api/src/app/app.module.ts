import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CrashControllerModule } from '@noloback/crash.controller';
import { LoggerLibModule } from '@noloback/logger-lib';
import { TranslatorLibModule } from '@noloback/translator-lib';
import { UsersControllerModule } from '@noloback/users.controller';
import { AuthControllerModule } from '@noloback/auth.controller';
import { SanctionsServiceModule } from '@noloback/sanctions.service';
import { RegisterModule } from '@noloback/register.controller';
import { CountriesControllerModule } from '@noloback/countries.controller';
import { DepartmentsControllerModule } from '@noloback/departments.controller';
import { CitiesControllerModule } from '@noloback/cities.controller';
import { AddressesControllerModule } from '@noloback/addresses.controller';
import { SitesControllerModule } from '@noloback/sites.controller';
import { ItemCategoriesControllerModule } from '@noloback/item.categories.controller';
import { ItemTypesControllerModule } from '@noloback/item.types.controller';
import { PersonsControllerModule } from '@noloback/persons.controller';
import { ItemsControllerModule } from '@noloback/items.controller';
import { ExhibitionsControllerModule } from '@noloback/exhibitions.controller';
import { VideoControllerModule } from '@noloback/video.controller';
import { SearchControllerModule } from '@noloback/search.controller';
import { ProfileControllerModule } from '@noloback/profile.controller';
import { EnumsControllerModule } from '@noloback/enums.controller';
import { SignLanguagesControllerModule } from '@noloback/sign.languages.controller';
import { SanctionsControllerModule } from '@noloback/sanctions.controller';
import { JwtAuthGuard } from '@noloback/guards';
import { RolesGuard } from '@noloback/roles';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    CrashControllerModule,
    AuthControllerModule,
    SanctionsServiceModule,
    LoggerLibModule,
    TranslatorLibModule,
    UsersControllerModule,
    RegisterModule,
    CountriesControllerModule,
    DepartmentsControllerModule,
    CitiesControllerModule,
    AddressesControllerModule,
    SitesControllerModule,
    ItemCategoriesControllerModule,
    ItemTypesControllerModule,
    PersonsControllerModule,
    ItemsControllerModule,
    ExhibitionsControllerModule,
    VideoControllerModule,
    SearchControllerModule,
    ProfileControllerModule,
    EnumsControllerModule,
    SignLanguagesControllerModule,
    SanctionsControllerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
