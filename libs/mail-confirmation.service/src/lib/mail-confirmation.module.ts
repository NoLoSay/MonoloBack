import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MailerServiceModule } from '@noloback/mailer';
import { MailConfirmationService } from './mail-confirmation.service'
import { UsersServiceModule } from '@noloback/users.service';

@Module({
  controllers: [],
  providers: [JwtService, MailConfirmationService],
  exports: [MailConfirmationService],
  imports: [MailerServiceModule, UsersServiceModule]
})
export class MailConfirmationServiceModule {}
