import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { LocationsServiceModule } from '@noloback/locations.service'
import { LocationsController } from './locations.controller'

@Module({
  controllers: [LocationsController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, LocationsServiceModule]
})
export class LocationsControllerModule {}
