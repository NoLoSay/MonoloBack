import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { PersonsService } from './persons.service';

@Module({
  controllers: [],
  providers: [PersonsService],
  exports: [PersonsService],
  imports: [PrismaClientBaseModule, LoggerLibModule],
})
export class PersonsServiceModule {}
