import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@noloback/auth.service';
import { SignLanguagesServiceModule } from '@noloback/sign.languages.service';
import { SignLanguagesController } from './sign.languages.controller';

@Module({
  controllers: [SignLanguagesController],
  providers: [],
  exports: [],
  imports: [AuthServiceModule, SignLanguagesServiceModule],
})
export class SignLanguagesControllerModule {}
