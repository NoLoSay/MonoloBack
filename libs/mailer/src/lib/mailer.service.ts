import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  private nodemailerTransport;

  constructor() {
    this.nodemailerTransport = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      name: 'Nolosay',
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['APP_PASSWORD'],
      },
      from: process.env['EMAIL_USER'],
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
