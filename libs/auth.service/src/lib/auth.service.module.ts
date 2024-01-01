import { Module } from '@nestjs/common';

import { UsersServiceModule } from '@noloback/users.service';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from '../../../../models/roles/admin-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminStrategy } from './strategies/roles/admin.strategy';
import { UserStrategy } from './strategies/roles/user.strategy';
import { ReferentStrategy } from './strategies/roles/referent.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaBaseService } from '@noloback/prisma-client-base';
import { JwtModule } from '@nestjs/jwt';
import { InstagramStrategy } from './strategies/instagram.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  controllers: [],
  providers: [
    AdminAuthGuard,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    UserStrategy,
    ReferentStrategy,
    AuthService,
    GoogleStrategy,
    InstagramStrategy,
    FacebookStrategy,
    PrismaBaseService,
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
