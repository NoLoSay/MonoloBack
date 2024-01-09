import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from '@noloback/users.service';

@Injectable()
export class MailingService {
  private transporter = nodemailer.createTransport({
    // configure your email service provider here
    service: 'gmail',
    auth: {
      user: 'nolomail@gmail.com',
      pass: 'nolomailpwd',
    },
  });

  async sendVerificationEmail(to: CreateUserDto, token: string): Promise<void> {
    const mailOptions = {
      from: 'nolomail@gmail.com',
      to,
      subject: 'Account Verification',
      text: `Click the following link to verify your email: ${process.env["APP_URL"]}/register/token?token=${token}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
