import { Module } from '@nestjs/common';

import { UsersServiceModule } from '@noloback/users.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaBaseService } from '@noloback/prisma-client-base';
import { JwtModule } from '@nestjs/jwt';
import { InstagramStrategy } from './strategies/instagram.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  controllers: [],
  providers: [
    LocalStrategy,
    JwtStrategy,
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
