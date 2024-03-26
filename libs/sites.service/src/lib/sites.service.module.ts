import { Module } from '@nestjs/common'
import { AddressesServiceModule } from '@noloback/addresses.service'
import { SitesService } from './sites.service'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { LoggerLibModule } from '@noloback/logger-lib'
export { SiteManipulationModel } from './models/siteManipulation.model'

@Module({
  controllers: [],
  providers: [SitesService],
  exports: [SitesService],
  imports: [AddressesServiceModule, PrismaClientBaseModule, LoggerLibModule]
})
export class SitesServiceModule {}
