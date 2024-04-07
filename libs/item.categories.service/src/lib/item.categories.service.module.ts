import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { ItemCategoriesService } from './item.categories.service'
export { ItemCategoryManipulationModel } from './models/itemCategoriesManipulation.model'

@Module({
  controllers: [],
  providers: [ItemCategoriesService],
  exports: [ItemCategoriesService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class ItemCategoriesServiceModule {}
