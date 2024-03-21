import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileServiceModule } from '@noloback/profile.service';

@Module({
  controllers: [ProfileController],
  providers: [],
  exports: [],
  imports: [ProfileServiceModule],
})
export class ProfileControllerModule {}
