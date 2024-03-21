import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaBaseService } from '@noloback/prisma-client-base';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private prismaBaseService: PrismaBaseService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env['PASSPORT_SESSION_KEY'],
    });
  }

  async validate(payload: any) {
    const user = await this.authService.connectUserByEmail(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
