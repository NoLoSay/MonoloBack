import {
  Controller,
  ExceptionFilter,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@noloback/guards';
import { Public } from '@noloback/jwt';
import { ADMIN, Roles, RolesGuard } from '@noloback/roles';
import { VideoService } from '@noloback/video.service';
import { Video } from '@prisma/client/base';
import { randomUUID } from 'crypto';
import { Response, response } from 'express';
import { readFile, readFileSync } from 'fs';
import { VideoFile } from 'models/swagger/youtube-file';
import multer = require('multer');
import { extname } from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
const upload = multer({ storage });

@Controller('upload')
export class UploadController {
  constructor(private readonly videoService: VideoService) {}

  @Get(':videoId')
  @Roles([ADMIN])
  async downloadLocal(
    @Request() request: any,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Param('videoId') videoId: string
  ) {
    try {
      // const video = await this.videoService.getYoutubeById(videoId);
      // if (!video) {
      //   return new NotFoundException("Video doesn't exist");
      // }
      // console.log(video);

      // if (video.video.hostingProviderId !== 1) {
      //   return new NotFoundException('Video is not hosted on NoLoSay servers');
      // }

      // const videoFile = readFileSync(join('/nolovideos', video.video.hostingProviderVideoId));
      // console.log(videoFile);

      const file = readFileSync('/nolovideos/' + videoId);
      if (!file) {
        return new NotFoundException("Video doesn't exist");
      }
      console.log(file);
      return res.status(200).send(file);

      // return res.status(200).contentType('file').send('/nolovideos/' + videoId);
    } catch (error: any) {
      console.log(error);
      if (error.code === 'ENOENT') {
        return new NotFoundException("Video doesn't exist");
      }
      return new InternalServerErrorException();
    }
  }

  @ApiBody({ type: VideoFile })
  @ApiConsumes('multipart/form-data')
  @Post(':itemId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: '/nolovideos',
        filename: (req, file, cb) => {
          const uuid = randomUUID();
          cb(null, `${uuid}${extname(file.originalname)}`);
        },
      }),
    })
  )
  async createYoutube(
    @Request() request: any,
    @UploadedFile() file: Express.Multer.File,
    @Param('itemId', ParseIntPipe) itemId: number
  ): Promise<Video> {
    const user = request.user;
    return await this.videoService.createYoutube(user, file, itemId);
  }
}
