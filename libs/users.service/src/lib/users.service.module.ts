import { Module } from '@nestjs/common';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { UsersService } from './users.service';
import { LoggerLibModule } from '@noloback/logger-lib';
export { UserUpdateModel, UserCreateModel } from './models/user.manipulation.models';

@Module({
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaClientBaseModule, LoggerLibModule],
})
export class UsersServiceModule {}
