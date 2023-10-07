import { Module } from '@nestjs/common';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { UsersService } from './users.service';

@Module({
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaClientBaseModule],
})
export class UsersLibModule {}
