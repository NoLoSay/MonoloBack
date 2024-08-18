import { Module } from '@nestjs/common';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { UsersService } from './users.service';
import { LoggerLibModule } from '@noloback/logger-lib';
import { SanctionsServiceModule } from '@noloback/sanctions.service';

@Module({
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaClientBaseModule, LoggerLibModule, SanctionsServiceModule],
})
export class UsersServiceModule {}
