import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { UsersLibModule } from '@noloback/users-lib';

@Module({
  imports: [PrismaClientBaseModule, UsersLibModule, LoggerLibModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class LvideoModule {}
