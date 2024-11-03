import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { ItemCategoriesService } from './item.categories.service';

@Module({
  controllers: [],
  providers: [ItemCategoriesService],
  exports: [ItemCategoriesService],
  imports: [PrismaClientBaseModule, LoggerLibModule],
})
export class ItemCategoriesServiceModule {}
