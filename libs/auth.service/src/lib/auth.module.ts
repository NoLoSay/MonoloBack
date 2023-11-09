import { Module } from '@nestjs/common';

import { UsersServiceModule } from '@noloback/users.service';
import { AuthController } from './auth-lib.controller';
import { AuthService } from './auth.service';
// import { Admin } from './decorators/roles/admin.decorator';
// import { User } from './decorators/roles/user.decorator';
// import { Referent } from './decorators/roles/referent.decorator';
import { AdminAuthGuard } from './guards/roles/admin-auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminStrategy } from './strategies/roles/admin.strategy';
import { UserStrategy } from './strategies/roles/user.strategy';
import { ReferentStrategy } from './strategies/roles/referent.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminAuthGuard,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    UserStrategy,
    ReferentStrategy,
  ],
  exports: [AuthService /*, Admin, User, Referent*/],
  imports: [
    UsersServiceModule,
    JwtModule.register({
      secret: process.env['PASSPORT_SESSION_KEY'],
      signOptions: { expiresIn: '30d' },
    }),
    PassportModule
  ],
})
export class AuthLibModule {}
