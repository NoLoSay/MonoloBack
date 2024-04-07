import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UsersService } from '@noloback/users.service';
import { MailerService } from '@noloback/mailer';
import { User } from '@prisma/client/base';
import { compare } from 'bcrypt';
import { Console, log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmailOrUsername(login);
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, uuid: user.uuid };
    return this.jwtService.sign(payload);
  }

  async findUserByUsername(username: string) {
    return this.usersService.findOneByUsername(username);
  }

  async findUserByEmail(email: string) {
    return this.usersService.findOneByEmail(email);
  }

  async changePassword(token: string, newPassword: string) {
    const userId = await this.decodeConfirmationToken(token);
    this.usersService.changePassword(userId, newPassword);

  }

  async forgotPassword(email: string): Promise<void> {
    log(email);
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = this.jwtService.sign({ userId: user.id }, {
      secret: process.env['JWT_VERIFICATION_TOKEN_SECRET'],
      expiresIn: '1h'
    });

    const url = `${process.env['RESET_PASSWORD_URL_TMP']}?token=${token}`;

    const text = `Click this link to reset your password: ${url}`; 

    await this.mailerService.sendMail({
      from: process.env['EMAIL_USER'],
      to: email,
      subject: 'Email confirmation',
      html: `<html><body>${text}</body></html>`,
    })
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
      if(error instanceof TokenExpiredError) {
        throw new BadRequestException('Token expired');
      }
      throw new BadRequestException('Bad token');
    }
  }
}
