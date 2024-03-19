import {
    Controller,
    Get,
    Query,
  } from '@nestjs/common';
  import ConfirmEmailDto from './dto/mail-confirmation.dto';
  import { MailConfirmationService } from '@noloback/mail-confirmation';
   
  @Controller('email-confirmation')
  export class MailConfirmationController {
    constructor(
      private readonly mailConfirmationService: MailConfirmationService
    ) {}
   
    @Get('confirm')
    async confirm(@Query('token') confirmationData: ConfirmEmailDto) {
      const email = await this.mailConfirmationService.decodeConfirmationToken(confirmationData.token);
      await this.mailConfirmationService.confirmEmail(email);
    }
  }
