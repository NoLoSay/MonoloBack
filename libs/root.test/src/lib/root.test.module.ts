import { Module } from '@nestjs/common';
import { LoggerService } from '@noloback/logger-lib';
import { PrismaBaseService, PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { ProfileService } from '@noloback/profile.service';
import { SitesManagersService } from '@noloback/sites.managers.service';
import { VideoService } from '@noloback/video.service';

@Module({
  providers: [
    {
      provide: VideoService,
      useValue: {},
    },
    {
      provide: PrismaBaseService,
      useValue: {},
    },
    {
      provide: LoggerService,
      useValue: {},
    },
    {
      provide: ProfileService,
      useValue: {},
    },
    {
      provide: SitesManagersService,
      useValue: {},
    },
  ],
  exports: [PrismaBaseService, LoggerService, ProfileService, SitesManagersService, VideoService],
})
export class RootTestModule {}
