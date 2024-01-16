import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { ExhibitionsServiceModule } from '@noloback/exhibitions.service'
import { ExhibitionsController } from './exhibitions.controller'
import { ExhibitedObjectsServiceModule } from '@noloback/exhibited.objects.service'
import { LocationsReferentsServiceModule } from '@noloback/locations.referents.service'

@Module({
  controllers: [ExhibitionsController],
  providers: [],
  exports: [],
  imports: [
    AuthServiceModule,
    ExhibitionsServiceModule,
    ExhibitedObjectsServiceModule,
    LocationsReferentsServiceModule
  ]
})
export class ExhibitionsControllerModule {}
