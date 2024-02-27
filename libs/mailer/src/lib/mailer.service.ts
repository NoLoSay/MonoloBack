import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
 
@Injectable()
export class MailerService {
  private nodemailerTransport;
 
  constructor() {
    this.nodemailerTransport = createTransport({
      service: process.env['EMAIL_SERVICE'],
      name:"www.hotmail.com",
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PASSWORD'],
      },
      from: process.env['EMAIL_USER'],
    });
  }
 
  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}