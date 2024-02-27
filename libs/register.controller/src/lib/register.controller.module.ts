import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { UsersServiceModule } from '@noloback/users.service';
import { MailConfirmationModule, MailConfirmationService } from '@noloback/mail-confirmation';
import { MailerServiceModule } from '@noloback/mailer';



@Module({
  controllers: [RegisterController],
  providers: [MailConfirmationService],
  exports: [],
  imports: [
    UsersServiceModule,
    MailConfirmationModule,
    MailerServiceModule
  ],
})
export class RegisterModule {}
