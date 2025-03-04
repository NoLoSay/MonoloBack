import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service';
import { ItemsServiceModule } from '@noloback/items.service';
import { ItemsController } from './items.controller';
import { SitesManagersServiceModule } from '@noloback/sites.managers.service';
import { UploadthingServiceModule } from '@noloback/uploadthing.service';
import { VideoServiceModule } from '@noloback/video.service';
import { LoggerLibModule } from '@noloback/logger-lib';

@Module({
  controllers: [ItemsController],
  providers: [],
  exports: [],
  imports: [
    AuthServiceModule,
    ItemsServiceModule,
    SitesManagersServiceModule,
    UploadthingServiceModule,
    LoggerLibModule,
    VideoServiceModule,
  ],
})
export class ItemsControllerModule {}
