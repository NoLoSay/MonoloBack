import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileServiceModule } from '@noloback/profile.service';
import { SitesManagersServiceModule } from '@noloback/sites.managers.service';

@Module({
  controllers: [ProfileController],
  providers: [],
  exports: [],
  imports: [ProfileServiceModule, SitesManagersServiceModule],
})
export class ProfileControllerModule {}
