import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { ItemsServiceModule } from '@noloback/items.service'
import { ItemsController } from './items.controller'
import { LocationsReferentsServiceModule } from '@noloback/locations.referents.service'
import { VideoServiceModule } from '@noloback/video.service'

@Module({
  controllers: [ItemsController],
  providers: [],
  exports: [],
  imports: [
    AuthServiceModule,
    ItemsServiceModule,
    LocationsReferentsServiceModule,
    VideoServiceModule
  ]
})
export class ItemsControllerModule {}
