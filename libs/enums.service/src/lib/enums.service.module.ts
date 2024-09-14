import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { EnumsService } from './enums.service'

@Module({
  controllers: [],
  providers: [EnumsService],
  exports: [EnumsService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class EnumsServiceModule {}
