import { Module } from '@nestjs/common';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { SanctionsService } from './sanctions.service';

@Module({
  controllers: [],
  providers: [SanctionsService],
  exports: [SanctionsService],
  imports: [PrismaClientBaseModule],
})
export class SanctionsServiceModule {}
