import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service';
import { ItemCategoriesServiceModule } from '@noloback/item.categories.service';
import { ItemCategoriesController } from './item.categories.controller';

@Module({
  controllers: [ItemCategoriesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, ItemCategoriesServiceModule],
})
export class ItemCategoriesControllerModule {}
