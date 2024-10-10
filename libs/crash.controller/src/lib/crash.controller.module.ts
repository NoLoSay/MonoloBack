import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib';
import { CrashController } from './crash.controller';

@Module({
  controllers: [CrashController],
  providers: [],
  exports: [],
  imports: [LoggerLibModule],
})
export class CrashControllerModule {}
