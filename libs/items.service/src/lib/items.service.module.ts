import { Module } from '@nestjs/common'
import { LoggerLibModule } from '@noloback/logger-lib'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { ItemsService } from './items.service'
import { VideoServiceModule } from '@noloback/video.service'

@Module({
  controllers: [],
  providers: [ItemsService],
  exports: [ItemsService],
  imports: [PrismaClientBaseModule, LoggerLibModule, VideoServiceModule]
})
export class ItemsServiceModule {}
