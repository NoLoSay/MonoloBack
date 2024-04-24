import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { ItemTypesService } from './item.types.service'

@Module({
  controllers: [],
  providers: [ItemTypesService],
  exports: [ItemTypesService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class ItemTypesServiceModule {}
