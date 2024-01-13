import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { CitiesService } from './cities.service'
export { CityManipulationModel } from './models/cityManipulation.model'

@Module({
  controllers: [],
  providers: [CitiesService],
  exports: [CitiesService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class CitiesServiceModule {}
