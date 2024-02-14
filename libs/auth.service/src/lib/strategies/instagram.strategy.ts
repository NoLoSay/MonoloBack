import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaBaseService } from '@noloback/prisma-client-base';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Strategy } from 'passport-instagram';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor(private prismaBaseService: PrismaBaseService) {
    super({
      clientID: process.env['INSTAGRAM_CLIENT_ID'],
      clientSecret: process.env['INSTAGRAM_CLIENT_SECRET'],
      callbackURL: process.env['INSTAGRAM_CALLBACK_URL'],
      scope: ['user_profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any
  ): Promise<any> {
    const { id, username, fullName, profilePicture, emails } = profile;

    // Assuming that emails is an array and the first element contains the user's email
    const userEmail = emails && emails.length > 0 ? emails[0].value : '';

    const user = {
      provider: 'instagram',
      providerId: id,
      username: username,
      name: fullName,
      email: userEmail,
      picture: profilePicture,
    };

    const oAuthProvider =
      await this.prismaBaseService.oAuthProviders.upsert({
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
                username: user.username,
              },
              update: {},
              create: {
                username: user.username,
                email: user.email,
                password: await hash(randomUUID(), 12),
                picture: user.picture,
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
        // Add additional fields based on your requirements
      },
    });

    return user;
  }
}
