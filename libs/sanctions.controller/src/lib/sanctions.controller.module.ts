import { Module } from '@nestjs/common';
import { SanctionsController } from './sanctions.controller';
import { SanctionsServiceModule } from '@noloback/sanctions.service';

@Module({
  controllers: [SanctionsController],
  providers: [],
  imports: [SanctionsServiceModule],
})
export class SanctionsControllerModule {}
