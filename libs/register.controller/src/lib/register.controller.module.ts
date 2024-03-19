import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { UsersServiceModule } from '@noloback/users.service';
import { MailConfirmationModule } from '@noloback/mail-confirmation';



@Module({
  controllers: [RegisterController],
  providers: [],
  exports: [],
  imports: [
    UsersServiceModule,
    MailConfirmationModule,
  ],
})
export class RegisterModule {}
