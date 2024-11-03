import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthServiceModule } from '@noloback/auth.service';
import { MailConfirmationServiceModule } from '@noloback/mail-confirmation.service';

@Module({
  controllers: [AuthController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, MailConfirmationServiceModule],
})
export class AuthControllerModule {}
