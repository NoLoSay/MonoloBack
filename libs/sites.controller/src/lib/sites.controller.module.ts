import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { SitesServiceModule } from '@noloback/sites.service'
import { SitesController } from './sites.controller'
import { SitesManagersServiceModule } from '@noloback/sites.managers.service'

@Module({
  controllers: [SitesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, SitesServiceModule, SitesManagersServiceModule]
})
export class SitesControllerModule {}
