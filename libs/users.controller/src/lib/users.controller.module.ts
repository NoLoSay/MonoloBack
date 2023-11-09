import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthServiceModule } from '@noloback/auth.service';
import { UsersServiceModule } from '@noloback/users.service';

@Module({
  controllers: [UsersController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, UsersServiceModule]
})
export class UsersControllerModule {}
