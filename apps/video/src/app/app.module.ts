import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthServiceModule } from '@noloback/auth.service';
import { VideoServiceModule } from '@noloback/video.service';

@Module({
  imports: [AuthServiceModule, VideoServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
