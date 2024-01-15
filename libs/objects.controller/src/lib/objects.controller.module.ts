import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { ObjectsServiceModule } from '@noloback/objects.service'
import { ObjectsController } from './objects.controller'

@Module({
  controllers: [ObjectsController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, ObjectsServiceModule]
})
export class ObjectsControllerModule {}
