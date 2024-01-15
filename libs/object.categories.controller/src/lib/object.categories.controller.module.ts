import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service';
import { ObjectCategoriesServiceModule } from '@noloback/object.categories.service';
import { ObjectCategoriesController } from './object.categories.controller';

@Module({
  controllers: [ObjectCategoriesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, ObjectCategoriesServiceModule],
})
export class ObjectCategoriesControllerModule {}
