import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { LoggerLibModule } from '@noloback/logger-lib';
export {
  VideoCommonListReturn,
  VideoCommonListSelect,
} from './models/video.api.models';

@Module({
  imports: [PrismaClientBaseModule, LoggerLibModule],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoServiceModule {}
