import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { VideoService } from './video.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({ dest: './uploads' })],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoServiceModule {}
