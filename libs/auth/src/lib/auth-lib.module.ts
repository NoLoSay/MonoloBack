import { Module } from '@nestjs/common';

import { UsersLibModule } from '@noloback/users-lib';
import { AuthController } from './auth-lib.controller';
import { AuthService } from './auth-lib.service';

@Module({
  controllers: [AuthController],
  providers: [],
  exports: [AuthService],
  imports: [UsersLibModule],
})
export class AuthLibModule {}
