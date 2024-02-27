import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [JwtService],
  exports: [],
})
export class MailConfirmationModule {}
