import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService, TokenExpiredError  } from '@nestjs/jwt';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import { MailerService } from '@noloback/mailer';
import { UsersService } from '@noloback/users.service';
 
@Injectable()
export class MailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}
 
  public async confirmEmail(email: string) {
    // TODO: create simple table in a user to see if his email is confirmed
    const user = await this.usersService.findOneByEmail(email);
    if (user?.emailVerified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
  }

  public sendVerificationLink(email: string) {

    const payload: VerificationTokenPayload = { email };

    const token = this.jwtService.sign(payload, {
      secret: process.env['JWT_VERIFICATION_TOKEN_SECRET'],
      expiresIn: `${process.env['JWT_VERIFICATION_TOKEN_EXPIRATION_TIME']}s`
    });
 
    const url = `${process.env['EMAIL_CONFIRMATION_URL_TMP']}?token=${token}`;
 
    const text = `To confirm your email address, click this link: ${url}`;
 
    return this.mailerService.sendMail({
      from: process.env['EMAIL_USER'],
      to: email,
      subject: 'Email confirmation',
      html: `<html><body> Hello and welcome to Nolosay ! ${text}</body></html>`,
    })
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env['JWT_VERIFICATION_TOKEN_SECRET'],
      });
 
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if(error instanceof TokenExpiredError) {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}