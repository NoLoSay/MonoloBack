import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service'
import { SitesServiceModule } from '@noloback/sites.service'
import { SearchController } from './search.controller'

@Module({
  controllers: [SearchController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, SitesServiceModule]
})
export class SearchControllerModule {}
