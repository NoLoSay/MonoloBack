import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthServiceModule } from '@noloback/auth.service';
import { UploadControllerModule } from '@noloback/upload.controller';
import { WatchControllerModule } from '@noloback/watch.controller';

@Module({
  imports: [AuthServiceModule, UploadControllerModule, WatchControllerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
