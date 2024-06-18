import { Module } from '@nestjs/common';
import { MailConfirmationController } from './mail-confirmation.controller'
import { MailerServiceModule } from '@noloback/mailer';
import { MailConfirmationModule } from '@noloback/mail-confirmation.service';




@Module({
  controllers: [MailConfirmationController],
  providers: [],
  exports: [],
  imports: [MailerServiceModule, MailConfirmationModule]
})
export class MailConfirmationControllerModule {}