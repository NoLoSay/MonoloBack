import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { RoomsServiceModule } from '@noloback/rooms.service'
import { SitesServiceModule } from '@noloback/sites.service'
import { SitesController } from './sites.controller'
import { SitesManagersServiceModule } from '@noloback/sites.managers.service'

@Module({
  controllers: [SitesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, SitesServiceModule, SitesManagersServiceModule, RoomsServiceModule]
})
export class SitesControllerModule {}
