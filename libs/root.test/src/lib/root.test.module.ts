import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AddressesService } from '@noloback/addresses.service';
import { AuthService } from '@noloback/auth.service';
import { CitiesService } from '@noloback/cities.service';
import { CountriesService } from '@noloback/countries.service';
import { DepartmentsService } from '@noloback/departments.service';
import { ExhibitedItemsService } from '@noloback/exhibited.items.service';
import { ExhibitionsService } from '@noloback/exhibitions.service';
import { ItemCategoriesService } from '@noloback/item.categories.service';
import { ItemTypesService } from '@noloback/item.types.service';
import { ItemsService } from '@noloback/items.service';
import { LoggerService } from '@noloback/logger-lib';
import { MailConfirmationService } from '@noloback/mail-confirmation.service';
import { MailerService } from '@noloback/mailer';
import { PersonsService } from '@noloback/persons.service';
import { PicturesService } from '@noloback/pictures.service';
import { PrismaBaseService, PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { PrismaLogsService } from '@noloback/prisma-client-logs';
import { PrismaTranslatorService } from '@noloback/prisma-client-translator';
import { ProfileService } from '@noloback/profile.service';
import { SanctionsService } from '@noloback/sanctions.service';
import { SignLanguagesService } from '@noloback/sign.languages.service';
import { SitesManagersService } from '@noloback/sites.managers.service';
import { SitesService } from '@noloback/sites.service';
import { UploadthingService } from '@noloback/uploadthing.service';
import { UsersService } from '@noloback/users.service';
import { UtilsService } from '@noloback/utils.service';
import { VideoService } from '@noloback/video.service';

@Module({
  providers: [
    // NodeModules
    {
      provide: JwtService,
      useValue: {}
    },
    // NoLoModules
    {
      provide: AddressesService,
      useValue: {},
    },
    {
      provide: AuthService,
      useValue: {},
    },
    {
      provide: CitiesService,
      useValue: {},
    },
    {
      provide: CountriesService,
      useValue: {},
    },
    {
      provide: DepartmentsService,
      useValue: {},
    },
    {
      provide: ExhibitedItemsService,
      useValue: {},
    },
    {
      provide: ExhibitionsService,
      useValue: {},
    },
    {
      provide: ItemCategoriesService,
      useValue: {},
    },
    {
      provide: ItemTypesService,
      useValue: {},
    },
    {
      provide: ItemsService,
      useValue: {},
    },
    {
      provide: LoggerService,
      useValue: {},
    },
    {
      provide: MailConfirmationService,
      useValue: {},
    },
    {
      provide: MailerService,
      useValue: {},
    },
    {
      provide: PersonsService,
      useValue: {},
    },
    {
      provide: PicturesService,
      useValue: {},
    },
    {
      provide: PrismaBaseService,
      useValue: {},
    },
    {
      provide: PrismaLogsService,
      useValue: {},
    },
    {
      provide: PrismaTranslatorService,
      useValue: {},
    },
    {
      provide: ProfileService,
      useValue: {},
    },
    {
      provide: SanctionsService,
      useValue: {},
    },
    {
      provide: SignLanguagesService,
      useValue: {},
    },
    {
      provide: SitesManagersService,
      useValue: {},
    },
    {
      provide: SitesService,
      useValue: {},
    },
    {
      provide: UploadthingService,
      useValue: {},
    },
    {
      provide: UsersService,
      useValue: {},
    },
    {
      provide: UtilsService,
      useValue: {},
    },
    {
      provide: VideoService,
      useValue: {},
    },
  ],
  exports: [
    // NodeModules
    JwtService,
    // NoLoModules
    AddressesService,
    AuthService,
    CitiesService,
    CountriesService,
    DepartmentsService,
    ExhibitedItemsService,
    ExhibitionsService,
    ItemCategoriesService,
    ItemTypesService,
    ItemsService,
    LoggerService,
    MailConfirmationService,
    MailerService,
    PersonsService,
    PicturesService,
    PrismaBaseService,
    PrismaLogsService,
    PrismaTranslatorService,
    ProfileService,
    SanctionsService,
    SignLanguagesService,
    SitesManagersService,
    SitesService,
    UploadthingService,
    UsersService,
    UtilsService,
    VideoService,
  ],
})
export class RootTestModule {}
