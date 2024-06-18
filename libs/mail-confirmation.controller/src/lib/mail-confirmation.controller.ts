import {
    Controller,
    Get,
    Query,
  } from '@nestjs/common';
  import { MailConfirmationService } from '@noloback/mail-confirmation.service';
  import { ConfirmEmailModel } from '@noloback/api.querry.parameters';
   
  @Controller('email-confirmation')
  export class MailConfirmationController {
    constructor(
      private readonly mailConfirmationService: MailConfirmationService
    ) {}
   
    @Get('confirm')
    async confirm(@Query('token') confirmationData: ConfirmEmailModel) {
      const email = await this.mailConfirmationService.decodeConfirmationToken(confirmationData.token);
      await this.mailConfirmationService.confirmEmail(email);
    }
  }
