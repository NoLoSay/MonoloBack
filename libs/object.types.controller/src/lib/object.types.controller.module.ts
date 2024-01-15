import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { ObjectTypesServiceModule } from '@noloback/object.types.service'
import { ObjectTypesController } from './object.types.controller'

@Module({
  controllers: [ObjectTypesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, ObjectTypesServiceModule]
})
export class ObjectTypesControllerModule {}
