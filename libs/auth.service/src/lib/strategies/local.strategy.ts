import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaBaseService } from '@noloback/prisma-client-base';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private prismaBaseService: PrismaBaseService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Bad Credentials');
    }

    await this.prismaBaseService.userLoginLog.create({
      data: {
        userId: +user.id,
      },
    });

    return user;
  }
}
