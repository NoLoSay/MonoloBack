import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service';
import { ExhibitionsServiceModule } from '@noloback/exhibitions.service';
import { ExhibitionsController } from './exhibitions.controller';
import { ExhibitedItemsServiceModule } from '@noloback/exhibited.items.service';
import { SitesManagersServiceModule } from '@noloback/sites.managers.service';
import { LoggerLibModule } from '@noloback/logger-lib';

@Module({
  controllers: [ExhibitionsController],
  providers: [],
  exports: [],
  imports: [
    AuthServiceModule,
    ExhibitionsServiceModule,
    ExhibitedItemsServiceModule,
    LoggerLibModule,
    SitesManagersServiceModule,
  ],
})
export class ExhibitionsControllerModule {}
