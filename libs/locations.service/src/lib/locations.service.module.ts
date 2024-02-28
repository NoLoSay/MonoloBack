import { Module } from '@nestjs/common'
import { AddressesServiceModule } from '@noloback/addresses.service'
import { LocationsService } from './locations.service'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { LoggerLibModule } from '@noloback/logger-lib'
export { LocationManipulationModel } from './models/locationManipulation.model'

@Module({
  controllers: [],
  providers: [LocationsService],
  exports: [LocationsService],
  imports: [AddressesServiceModule, PrismaClientBaseModule, LoggerLibModule]
})
export class LocationsServiceModule {}
