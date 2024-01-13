import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service';
import { CountriesServiceModule } from '@noloback/countries.service';
import { ContriesController } from './countries.controller';

@Module({
  controllers: [ContriesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, CountriesServiceModule],
})
export class CountriesControllerModule {}
