import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { ExhibitionsServiceModule } from '@noloback/exhibitions.service'
import { ExhibitionsController } from './exhibitions.controller'
import { ExhibitedItemsServiceModule } from '@noloback/exhibited.items.service'
import { LocationsReferentsServiceModule } from '@noloback/locations.referents.service'

@Module({
  controllers: [ExhibitionsController],
  providers: [],
  exports: [],
  imports: [
    AuthServiceModule,
    ExhibitionsServiceModule,
    ExhibitedItemsServiceModule,
    LocationsReferentsServiceModule
  ]
})
export class ExhibitionsControllerModule {}
