import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { ExhibitionsService } from './exhibitions.service'
import { SitesManagersServiceModule } from '@noloback/sites.managers.service'
export { ExhibitionManipulationModel } from './models/exhibitionManipulation.model'

@Module({
  controllers: [],
  providers: [ExhibitionsService],
  exports: [ExhibitionsService],
  imports: [PrismaClientBaseModule, LoggerLibModule, SitesManagersServiceModule]
})
export class ExhibitionsServiceModule {}
