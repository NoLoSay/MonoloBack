import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service'
import { LocationsServiceModule } from '@noloback/locations.service'
import { SearchController } from './search.controller'

@Module({
  controllers: [SearchController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, LocationsServiceModule]
})
export class SearchControllerModule {}
