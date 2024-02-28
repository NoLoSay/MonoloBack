import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { LocationsServiceModule } from '@noloback/locations.service'
import { LocationsController } from './locations.controller'
import { LocationsReferentsServiceModule } from '@noloback/locations.referents.service'

@Module({
  controllers: [LocationsController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, LocationsServiceModule, LocationsReferentsServiceModule]
})
export class LocationsControllerModule {}
