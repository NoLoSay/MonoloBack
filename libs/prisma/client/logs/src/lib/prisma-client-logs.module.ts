import { Module } from '@nestjs/common';
import { PrismaLogsService } from './prisma.service';

@Module({
  controllers: [],
  providers: [PrismaLogsService],
  exports: [PrismaLogsService],
})
export class PrismaClientLogsModule {}
