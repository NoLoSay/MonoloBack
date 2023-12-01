import { Module } from '@nestjs/common';

import { PrismaClientLogsModule } from '@noloback/prisma-client-logs';
import { LoggerService } from './logger.service';

@Module({
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [PrismaClientLogsModule],
})
export class LoggerLibModule {}
