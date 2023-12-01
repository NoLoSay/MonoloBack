import { Module } from '@nestjs/common';

import { UsersServiceModule } from '@noloback/users.service';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './guards/roles/admin-auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminStrategy } from './strategies/roles/admin.strategy';
import { UserStrategy } from './strategies/roles/user.strategy';
import { ReferentStrategy } from './strategies/roles/referent.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [],
  providers: [
    AdminAuthGuard,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    UserStrategy,
    ReferentStrategy,
    AuthService,
  ],
  exports: [AuthService],
  imports: [
    UsersServiceModule,
    JwtModule.register({
      secret: process.env['PASSPORT_SESSION_KEY'],
      signOptions: { expiresIn: '30d' },
    }),
    PassportModule,
  ],
})
export class AuthServiceModule {}
