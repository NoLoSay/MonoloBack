import { Module } from '@nestjs/common';

import { PrismaClientLogsModule } from '@noloback/prisma-client-logs';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { LoggerService } from './logger.service';

@Module({
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [PrismaClientLogsModule, PrismaClientBaseModule],
})
export class LoggerLibModule {}
