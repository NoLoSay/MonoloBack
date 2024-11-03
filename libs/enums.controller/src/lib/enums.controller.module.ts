import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service';
import { EnumsServiceModule } from '@noloback/enums.service';
import { EnumsController } from './enums.controller';

@Module({
  controllers: [EnumsController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, EnumsServiceModule],
})
export class EnumsControllerModule {}
