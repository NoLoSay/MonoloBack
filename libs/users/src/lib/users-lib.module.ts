import { Module } from '@nestjs/common';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { UsersService } from './users-lib.service';
import { LoggerLibModule } from '@noloback/logger-lib';
export { CreateUserDto } from './dto/create-user.dto';
export { UpdateUserDto } from './dto/update-user.dto';

@Module({
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaClientBaseModule, LoggerLibModule],
})
export class UsersLibModule {}
