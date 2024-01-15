import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { ObjectTypesService } from './object.types.service'
export { ObjectTypeManipulationModel } from './models/objectTypesManipulation.model'

@Module({
  controllers: [],
  providers: [ObjectTypesService],
  exports: [ObjectTypesService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class ObjectTypesServiceModule {}
