import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { SitesServiceModule } from '@noloback/sites.service'
import { SitesController } from './sites.controller'
import { SitesManagersServiceModule } from '@noloback/sites.managers.service'
import { LoggerLibModule } from '@noloback/logger-lib'

@Module({
  controllers: [SitesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, SitesServiceModule, SitesManagersServiceModule, LoggerLibModule]
})
export class SitesControllerModule {}
