import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
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

  public async confirmEmail(
    email: string,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (user.emailVerified) {
        throw new BadRequestException('Email already confirmed');
      }

      await this.usersService.markEmailAsConfirmed(email);

      return {
        statusCode: 200,
        message: 'Email confirmed successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while confirming the email',
        );
      }
    }
  }

  public sendVerificationLink(email: string) {
    try {
      const payload: VerificationTokenPayload = { email };

      const token = this.jwtService.sign(payload, {
        secret: process.env['JWT_VERIFICATION_TOKEN_SECRET'],
        expiresIn: `${process.env['JWT_VERIFICATION_TOKEN_EXPIRATION_TIME']}s`,
      });

      const url = `${process.env['EMAIL_CONFIRMATION_URL']}?token=${token}`;

      const text = `To confirm your email address, click this link: ${url}`;

      this.mailerService.sendMail({
        from: process.env['EMAIL_USER'],
        to: email,
        subject: 'Email confirmation',
        html: `<html><body>Hello and welcome to Nolosay! ${text}</body></html>`,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        // Replace with actual error type if known
        throw new BadRequestException('Invalid data provided');
      } else {
        throw new InternalServerErrorException(
          'Failed to send verification link',
        );
      }
    }
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
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
