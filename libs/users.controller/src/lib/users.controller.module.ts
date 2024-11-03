import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthServiceModule } from '@noloback/auth.service';
import { UsersServiceModule } from '@noloback/users.service';
import { VideoServiceModule } from '@noloback/video.service';
import { SanctionsServiceModule } from '@noloback/sanctions.service';

@Module({
  controllers: [UsersController],
  providers: [],
  exports: [],
  imports: [
    AuthServiceModule,
    UsersServiceModule,
    VideoServiceModule,
    SanctionsServiceModule,
  ],
})
export class UsersControllerModule {}
