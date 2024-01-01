import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { VideoController } from './video.controller';
import { VideoService, VideoServiceModule } from '@noloback/video.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({ dest: './uploads' }),
    VideoServiceModule,
  ],
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoControllerModule {}
