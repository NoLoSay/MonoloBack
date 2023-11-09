import { Module } from '@nestjs/common';

import { UsersLibModule } from '@noloback/users-lib';
import { AuthController } from './auth-lib.controller';
import { AuthService } from './auth-lib.service';
// import { Admin } from './decorators/roles/admin.decorator';
// import { User } from './decorators/roles/user.decorator';
// import { Referent } from './decorators/roles/referent.decorator';
import { AdminAuthGuard } from './guards/roles/admin-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard, JwtService],
  exports: [AuthService/*, Admin, User, Referent*/],
  imports: [UsersLibModule],
})
export class AuthLibModule {}
