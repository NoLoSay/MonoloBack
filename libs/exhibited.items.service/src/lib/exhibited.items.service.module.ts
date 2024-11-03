import { Module } from '@nestjs/common';
import { ExhibitedItemsService } from './exhibited.items.service';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';

@Module({
  controllers: [],
  providers: [ExhibitedItemsService],
  exports: [ExhibitedItemsService],
  imports: [PrismaClientBaseModule, LoggerLibModule],
})
export class ExhibitedItemsServiceModule {}
