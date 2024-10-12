import { Module } from '@nestjs/common';

import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { LoggerService } from './logger.service';

@Module({
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [PrismaClientBaseModule],
})
export class LoggerLibModule {}
