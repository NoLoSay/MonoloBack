import {
  Controller,
  Get,
  Header,
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
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  @Public()
  async watchVideo(
    @Request() request: any,
    @Res({ passthrough: true }) res: Response,
    @Param('videoUUID') videoUUID: string,
  ) {
    // LoggerService.userLog(
    //   +request.user.activeProfile.id,
    //   'GET',
    //   'Watch',
    //   +0,
    //   JSON.stringify({ videoUUID })
    // );

    const videoFile = await this.videoService.watchVideo(videoUUID);
    // console.log('file', videoFile.file);
    // console.log('size', videoFile.size);
    // res.writeHead(200, {
    //   'Content-Length': videoFile.size,
    // });
    // videoFile.file.pipe(res);
    return new FixedStreamableFile(videoFile.file, {
      length: videoFile.size,
      type: 'video/mp4',
    });
  }
}

class FixedStreamableFile extends StreamableFile {
  errorLogger: any = console.error;
}
