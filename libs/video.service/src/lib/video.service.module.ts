import { Module } from '@nestjs/common';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
import { UsersServiceModule } from '@noloback/users.service';
import { VideoService } from './video.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    PrismaClientBaseModule,
    UsersServiceModule,
    LoggerLibModule,
    HttpModule,
  ],
  controllers: [],
  providers: [
    VideoService,
    HttpService,
    {
      provide: 'AXIOS_INSTANCE_TOKEN',
      useValue: process.env['AXIOS_INSTANCE_TOKEN'],
    },
  ],
  exports: [VideoService],
})
export class VideoServiceModule {}
