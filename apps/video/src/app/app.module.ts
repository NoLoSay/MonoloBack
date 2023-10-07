import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerLibModule } from '@noloback/logger-lib';

@Module({
  imports: [LoggerLibModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
