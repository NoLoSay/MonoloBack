import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { CountriesService } from './countries.service';
export { CountryManipulationModel } from './models/country-manipulation.model';

@Module({
  controllers: [],
  providers: [CountriesService],
  exports: [CountriesService],
  imports: [PrismaClientBaseModule, LoggerLibModule],
})
export class CountriesServiceModule {}
