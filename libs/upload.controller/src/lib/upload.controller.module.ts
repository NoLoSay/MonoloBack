import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { VideoServiceModule } from '@noloback/video.service';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({ dest: './uploads' }),
    VideoServiceModule,
  ],
  providers: [],
  controllers: [UploadController],
})
export class UploadControllerModule {}
