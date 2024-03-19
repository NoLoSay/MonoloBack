import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { VideoController } from './video.controller';
import { VideoService, VideoServiceModule } from '@noloback/video.service';

@Module({
  imports: [VideoServiceModule],
  providers: [],
  controllers: [VideoController],
})
export class VideoControllerModule {}
