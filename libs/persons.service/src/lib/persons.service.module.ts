import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { PersonsService } from './persons.service';
import { UtilsServiceModule } from '@noloback/utils.service';

@Module({
  controllers: [],
  providers: [PersonsService],
  exports: [PersonsService],
  imports: [PrismaClientBaseModule, LoggerLibModule, UtilsServiceModule],
})
export class PersonsServiceModule {}
