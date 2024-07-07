import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { UsersServiceModule } from '@noloback/users.service';
import { MailConfirmationServiceModule } from '@noloback/mail-confirmation.service';



@Module({
  controllers: [RegisterController],
  providers: [],
  exports: [],
  imports: [
    UsersServiceModule,
    MailConfirmationServiceModule,
  ],
})
export class RegisterModule {}
