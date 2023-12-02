import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaBaseService } from '@noloback/prisma-client-base';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private prismaBaseService: PrismaBaseService) {
    super({
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: process.env["GOOGLE_CALLBACK_URL"],
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
    
    console.log(user);

    let dbUser = await this.prismaBaseService.oAuthProviderUser.findFirst({
      where: {
        provider: {
          provider: user.provider
        },
        user: {
          email: user.email
        },
      }
    });

    if (!dbUser)
      dbUser = await this.prismaBaseService.oAuthProviderUser.create({
      data: {
        providerId: (await this.prismaBaseService.oAuthProviders.findUniqueOrThrow({
          where: {
            provider: user.provider
          }
        })).providerId,
        userId: (await this.prismaBaseService.user.create({
          data: {
            email: user.email,
            password: await hash(randomUUID(), 12),
            picture: user.picture,
          }
        })).id
      }
    })
      // throw UnauthorizedException;

    console.log(dbUser);

    done(null, user);
  }
}
