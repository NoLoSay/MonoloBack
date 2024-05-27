import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Public } from '@noloback/jwt';
import { LoggerService } from '@noloback/logger-lib';
import { VideoService } from '@noloback/video.service';
import { Video } from '@prisma/client/base';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { VideoFile } from 'models/swagger/youtube-file';
import multer = require('multer');
import { extname, join } from 'path';

@Controller('watch')
export class WatchController {
  constructor(private readonly videoService: VideoService) {}

  @Get(':videoUUID')
  @Public()
  async watchVideo(
    @Request() request: any,
    @Res({ passthrough: true }) res: Response,
    @Param('videoUUID') videoUUID: string
  ): Promise<StreamableFile> {
    // LoggerService.userLog(
    //   +request.user.activeProfile.id,
    //   'GET',
    //   'Watch',
    //   +0,
    //   JSON.stringify({ videoUUID })
    // );

    const videoFile = await this.videoService.watchVideo(videoUUID);
    res.set({
      'Content-Type': 'video/mp4',
    });
    return new StreamableFile(videoFile);
  }
}
