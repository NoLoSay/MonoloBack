import { Module } from '@nestjs/common';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { UsersService } from './users.service';
import { LoggerLibModule } from '@noloback/logger-lib';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Module({
  controllers: [],
  providers: [UsersService, CreateUserDto, UpdateUserDto],
  exports: [UsersService, CreateUserDto, UpdateUserDto],
  imports: [PrismaClientBaseModule, LoggerLibModule],
})
export class UsersLibModule {}
