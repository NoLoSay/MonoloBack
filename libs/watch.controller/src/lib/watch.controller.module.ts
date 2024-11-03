import { Module } from '@nestjs/common';
import { WatchController } from './watch.controller';
import { MulterModule } from '@nestjs/platform-express';
import { VideoServiceModule } from '@noloback/video.service';

@Module({
  imports: [MulterModule.register({ dest: './uploads' }), VideoServiceModule],
  controllers: [WatchController],
  providers: [],
  exports: [],
})
export class WatchControllerModule {}
