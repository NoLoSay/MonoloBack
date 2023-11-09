import { Module } from '@nestjs/common';
import { UsersController } from './users-lib.controller';
import { AuthLibModule } from '@noloback/auth-lib';
import { UsersLibModule } from '@noloback/users-lib';

@Module({
  controllers: [UsersController],
  providers: [],
  exports: [],
  imports: [AuthLibModule, UsersLibModule]
})
export class UsersControllerModule {}
