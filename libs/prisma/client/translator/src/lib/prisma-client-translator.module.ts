import { Module } from '@nestjs/common';
import { PrismaTranslatorService } from './prisma.service';

@Module({
  controllers: [],
  providers: [PrismaTranslatorService],
  exports: [PrismaTranslatorService],
})
export class PrismaClientTranslatorModule {}
