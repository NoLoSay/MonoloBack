import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaBaseService } from '@noloback/prisma-client-base';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private prismaBaseService: PrismaBaseService) {
    super({
      clientID: process.env['APPLE_CLIENT_ID'],
      teamID: process.env['APPLE_TEAM_ID'],
      callbackURL: process.env['APPLE_CALLBACK_URL'],
      keyID: process.env['APPLE_KEY_ID'],
      privateKeyLocation: process.env['APPLE_PRIVATE_KEY_LOCATION'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    idToken: any,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    // const { id, name, emails, photos } = profile;
    console.log(req);
    console.log(accessToken);
    console.log(refreshToken);
    console.log(idToken);
    console.log(profile);

    // const user = {
    //   provider: 'apple',
    //   providerId: id,
    //   email: emails[0].value,
    //   name: `${name.givenName} ${name.familyName}`,
    //   picture: photos[0].value,
    // };

    // const oAuthProvider = await this.prismaBaseService.oAuthProviders.upsert({
    //   where: {
    //     provider: user.provider,
    //   },
    //   create: {
    //     provider: user.provider,
    //   },
    //   update: {},
    // });

    // let dbUser = await this.prismaBaseService.oAuthProviderUser.findFirst({
    //   where: {
    //     provider: oAuthProvider,
    //     user: {
    //       email: user.email,
    //     },
    //     providerUserId: user.providerId,
    //   },
    // });

    // if (!dbUser) {
    //   dbUser = await this.prismaBaseService.oAuthProviderUser.create({
    //     data: {
    //       providerId: oAuthProvider.providerId,
    //       userId: (
    //         await this.prismaBaseService.user.upsert({
    //           where: {
    //             email: user.email,
    //           },
    //           update: {},
    //           create: {
    //             email: user.email,
    //             password: await hash(randomUUID(), 12),
    //             picture: user.picture,
    //           },
    //         })
    //       ).id,
    //       providerUserId: user.providerId,
    //     },
    //   });
    // }

    // await this.prismaBaseService.userLoginLog.create({
    //   data: {
    //     providerId: oAuthProvider.providerId,
    //     userId: dbUser.userId,
    //     // ip:
    //     // loginMethod: this.prismaBaseService.oAuthProviders
    //   },
    // });

    // done(null, user);
  }
}
