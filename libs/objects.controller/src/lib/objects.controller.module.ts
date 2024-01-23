import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { ObjectsServiceModule } from '@noloback/objects.service'
import { ObjectsController } from './objects.controller'
import { LocationsReferentsServiceModule } from '@noloback/locations.referents.service'

@Module({
  controllers: [ObjectsController],
  providers: [],
  exports: [],
  imports: [
    AuthServiceModule,
    ObjectsServiceModule,
    LocationsReferentsServiceModule
  ]
})
export class ObjectsControllerModule {}
