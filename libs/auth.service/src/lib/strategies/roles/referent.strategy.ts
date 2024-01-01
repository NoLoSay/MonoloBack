import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { PrismaBaseService } from '@noloback/prisma-client-base';

@Injectable()
export class ReferentStrategy extends PassportStrategy(
  Strategy,
  'role.referent'
) {
  constructor(
    private readonly authService: AuthService,
    private prismaBaseService: PrismaBaseService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['PASSPORT_SESSION_KEY'],
    });
  }

  async validate(payload: any) {
    const user = await this.authService.findUserByEmail(payload.email);
    if (!user || (user.role !== 'REFERENT' && user.role !== 'ADMIN')) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
