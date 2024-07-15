import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { AddressesService } from './addresses.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  controllers: [],
  providers: [AddressesService],
  exports: [AddressesService],
  imports: [PrismaClientBaseModule, LoggerLibModule, HttpModule]
})
export class AddressesServiceModule {}
