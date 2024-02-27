import { Injectable } from '@nestjs/common';
//import { JwtService } from '@nestjs/jwt';
//import VerificationTokenPayload from './verificationTokenPayload.interface';
import { MailerService } from '@noloback/mailer';
//import { UsersService } from '../users/users.service';
 
@Injectable()
export class MailConfirmationService {
  constructor(
    //private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
 
  public sendVerificationLink(email: string) {
    const payload = { email: email };

    const token = 'token';
    // const token = this.jwtService.sign(payload, {
    //   secret: process.env['JWT_VERIFICATION_TOKEN_SECRET'],
    //   expiresIn: `${process.env['JWT_VERIFICATION_TOKEN_EXPIRATION_TIME']}s`
    // });
 
    const url = `${process.env['EMAIL_CONFIRMATION_URL']}?token=${token}`;
 
    const text = `Welcome to the application. To confirm the email address`;
 
    return this.mailerService.sendMail({
      from: process.env['EMAIL_USER'],
      to: email,
      subject: 'Email confirmation',
      html: '<html><body> Hello and welcome </body></html>',
      text: 'Hello world',
    })
  }
}