import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthLibModule } from '@noloback/auth-lib';
import { UsersServiceModule } from '@noloback/users.service';

@Module({
  controllers: [UsersController],
  providers: [],
  exports: [],
  imports: [AuthLibModule, UsersServiceModule]
})
export class UsersControllerModule {}
