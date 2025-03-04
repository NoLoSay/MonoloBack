import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UsersService } from '@noloback/users.service';
import { MailerService } from '@noloback/mailer';
import { SanctionsService } from '@noloback/sanctions.service';
import { User } from '@prisma/client/base';
import { compare } from 'bcrypt';
import { Console, log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private sanctionsService: SanctionsService,
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.usersService.connectUserByEmailOrUsername(login);
    // if ((await this.sanctionsService.getUserSanctionsById(user.id))?.banned) {
    //   throw new UnauthorizedException('User is banned');
    // }
    if (user && user.password && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<any> {
    const payload = { username: user.email, sub: { uuid: user.uuid } };

    const result = {
      ...user,
      accessToken: this.jwtService.sign(payload),
    };

    return result;
  }

  async connectUserByUsername(username: string) {
    return this.usersService.findOneByUsername(username);
  }

  async connectUserByEmail(email: string) {
    return this.usersService.findOneByEmail(email);
  }

  async changePassword(
    password: string,
    token?: string,
    oldPassword?: string,
    userMail?: string,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      if (token) {
        const userId = await this.decodeConfirmationToken(token);
        await this.usersService.changePassword(userId, password);
      } else if (userMail && oldPassword) {
        const user = await this.validateUser(userMail, oldPassword);
        if (!user) {
          throw new BadRequestException('Wrong mail or old password');
        }
        await this.usersService.changePassword(user.id, password);
      }
      return {
        statusCode: 200,
        message: 'Password changed successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while changing the password',
        );
      }
    }
  }

  async forgotPassword(
    email: string,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const token = this.jwtService.sign(
        { userId: user.id },
        {
          secret: process.env['JWT_VERIFICATION_TOKEN_SECRET'],
          expiresIn: '1h',
        },
      );

      const url = `${process.env['RESET_PASSWORD_URL']}?token=${token}`;

      const text = `Click this link to reset your password: ${url}`;

      await this.mailerService.sendMail({
        from: process.env['EMAIL_USER'],
        to: email,
        subject: 'Email confirmation',
        html: `<html><body>${text}</body></html>`,
      });
      return {
        statusCode: 200,
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while sending the password reset email',
        );
      }
    }
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env['JWT_VERIFICATION_TOKEN_SECRET'],
      });

      if (typeof payload === 'object' && 'userId' in payload) {
        return payload.userId;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('Token expired');
      }
      throw new BadRequestException('Bad token');
    }
  }
}
