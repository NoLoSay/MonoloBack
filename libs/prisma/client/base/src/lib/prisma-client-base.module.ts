import { Module } from '@nestjs/common';
import { PrismaBaseService } from './prisma.service';

@Module({
  controllers: [],
  providers: [PrismaBaseService],
  exports: [PrismaBaseService],
})
export class PrismaClientBaseModule {}
