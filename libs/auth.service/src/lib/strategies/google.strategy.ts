import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaBaseService, Role } from '@noloback/prisma-client-base';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private prismaBaseService: PrismaBaseService) {
    super({
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL: process.env['GOOGLE_CALLBACK_URL'],
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    const oAuthProvider = await this.prismaBaseService.oAuthProviders.upsert({
      where: {
        provider: user.provider,
      },
      create: {
        provider: user.provider,
      },
      update: {},
    });

    let dbUser = await this.prismaBaseService.oAuthProviderUser.findFirst({
      where: {
        provider: oAuthProvider,
        user: {
          email: user.email,
        },
        providerUserId: user.providerId,
      },
    });

    if (!dbUser) {
      dbUser = await this.prismaBaseService.oAuthProviderUser.create({
        data: {
          providerId: oAuthProvider.providerId,
          userId: (
            await this.prismaBaseService.user.upsert({
              where: {
                email: user.email,
              },
              update: {},
              create: {
                email: user.email,
                emailVerified: true,
                password: await hash(randomUUID(), 12),
                picture: user.picture,
                profiles: {
                  create: {
                    role: Role.USER,
                    isActive: true,
                  },
                },
              },
            })
          ).id,
          providerUserId: user.providerId,
        },
      });
    }

    await this.prismaBaseService.userLoginLog.create({
      data: {
        providerId: oAuthProvider.providerId,
        userId: dbUser.userId,
        // ip:
        // loginMethod: this.prismaBaseService.oAuthProviders
      },
    });

    done(null, user);
  }
}
