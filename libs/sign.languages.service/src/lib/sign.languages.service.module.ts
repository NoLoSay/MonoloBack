import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { SignLanguagesService } from './sign.languages.service'

@Module({
  controllers: [],
  providers: [SignLanguagesService],
  exports: [SignLanguagesService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class SignLanguagesServiceModule {}
