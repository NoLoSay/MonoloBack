import { Module } from '@nestjs/common'
import { ExhibitedObjectsService } from './exhibited.objects.service'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
export { ExhibitedObjectAdditionModel } from './models/exhibitedObjectManipulation.model'

@Module({
  controllers: [],
  providers: [ExhibitedObjectsService],
  exports: [ExhibitedObjectsService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class ExhibitedObjectsServiceModule {}
