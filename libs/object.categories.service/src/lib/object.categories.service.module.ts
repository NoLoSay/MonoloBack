import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { ObjectCategoriesService } from './object.categories.service'
export { ObjectCategoryManipulationModel } from './models/objectCategoriesManipulation.model'

@Module({
  controllers: [],
  providers: [ObjectCategoriesService],
  exports: [ObjectCategoriesService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class ObjectCategoriesServiceModule {}
