import { Module } from '@nestjs/common'
import { AddressesServiceModule } from '@noloback/addresses.service'
import { SitesService } from './sites.service'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { LoggerLibModule } from '@noloback/logger-lib'
import { SitesManagersServiceModule } from '@noloback/sites.managers.service'

@Module({
  controllers: [],
  providers: [SitesService],
  exports: [SitesService],
  imports: [
    AddressesServiceModule,
    PrismaClientBaseModule,
    LoggerLibModule,
    SitesManagersServiceModule
  ]
})
export class SitesServiceModule {}
