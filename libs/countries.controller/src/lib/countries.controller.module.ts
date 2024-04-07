import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service';
import { CountriesServiceModule } from '@noloback/countries.service';
import { CountriesController } from './countries.controller';

@Module({
  controllers: [CountriesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, CountriesServiceModule],
})
export class CountriesControllerModule {}
