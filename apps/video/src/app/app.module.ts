import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthServiceModule } from '@noloback/auth.service';
import { LvideoModule } from '@noloback/lvideo';

@Module({
  imports: [AuthServiceModule, LvideoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
