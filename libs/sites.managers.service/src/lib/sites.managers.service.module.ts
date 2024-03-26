import { Module } from '@nestjs/common';
import { SitesManagersService } from './sites.managers.service';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
export { SiteManagerAdditionModel, SiteManagerModificationModel } from './models/siteManagerManipulation.model';


@Module({
  controllers: [],
  providers: [SitesManagersService],
  exports: [SitesManagersService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class SitesManagersServiceModule {}
