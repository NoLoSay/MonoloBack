import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { DepartmentsService } from './departments.service';

@Module({
  controllers: [],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
  imports: [PrismaClientBaseModule, LoggerLibModule],
})
export class DepartmentsServiceModule {}
