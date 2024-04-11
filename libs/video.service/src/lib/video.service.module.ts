import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { VideoService } from './video.service'
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { LoggerLibModule } from '@noloback/logger-lib'
import { ProfileServiceModule } from '@noloback/profile.service'
import { SitesManagersServiceModule } from '@noloback/sites.managers.service'

@Module({
  imports: [
    PrismaClientBaseModule,
    LoggerLibModule,
    ProfileServiceModule,
    SitesManagersServiceModule
  ],
  providers: [VideoService],
  exports: [VideoService]
})
export class VideoServiceModule {}
