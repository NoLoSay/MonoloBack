import { Module } from '@nestjs/common'
import { AuthServiceModule } from '@noloback/auth.service'
import { ItemTypesServiceModule } from '@noloback/item.types.service'
import { ItemTypesController } from './item.types.controller'

@Module({
  controllers: [ItemTypesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, ItemTypesServiceModule]
})
export class ItemTypesControllerModule {}
