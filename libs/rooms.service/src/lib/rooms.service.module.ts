import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';

@Module({
  controllers: [],
  providers: [RoomsService],
  exports: [RoomsService],
  imports: [PrismaClientBaseModule]
})
export class RoomsServiceModule {}
