import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';

@Module({
  controllers: [VideoController],
  providers: [],
  exports: [],
})
export class VideoControllerModule {}
