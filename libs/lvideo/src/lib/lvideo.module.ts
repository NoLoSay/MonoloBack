import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { UsersServiceModule } from 'libs/users.service/src';

@Module({
  imports: [PrismaClientBaseModule, UsersServiceModule, LoggerLibModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class LvideoModule {}
