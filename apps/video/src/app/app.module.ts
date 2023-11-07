import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthLibModule } from '@noloback/auth-lib';
import { LvideoModule } from '@noloback/lvideo';

@Module({
  imports: [AuthLibModule, LvideoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
