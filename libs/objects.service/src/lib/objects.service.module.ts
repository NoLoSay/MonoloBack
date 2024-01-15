import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { ObjectsService } from './objects.service'
export { ObjectManipulationModel } from './models/objectManipulation.model'

@Module({
  controllers: [],
  providers: [ObjectsService],
  exports: [ObjectsService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class ObjectsServiceModule {}
