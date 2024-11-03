import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import { ADMIN, Roles } from '@noloback/roles';
import { VideoService } from '@noloback/video.service';
import { Video } from '@prisma/client/base';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { readFileSync, unlink } from 'fs';
import { VideoFile } from 'models/swagger/youtube-file';
import multer = require('multer');
import { extname } from 'path';
import { Express } from 'express'; // DO NOT REMOVE, REQUIRED FOR UNIT TESTS

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

  @Put(':videoId/provider')
  @Roles([ADMIN])
  async setHostingProvider(
    @Request() request: any,
    @Param('videoId') videoId: number,
    @Query('providerId', ParseIntPipe) providerId: number,
    @Query('providerVideoId') providerVideoId: string
  ) {
    const video = await this.videoService.getYoutubeById(+videoId);
    if (video) {
      if (video.video.hostingProviderId === 1) {
        unlink(`${process.env["LOCAL_VIDEO_PATH"]}/` + video.video.hostingProviderVideoId, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      return await this.videoService.setHostingProvider(
        +videoId,
        +providerId,
        providerVideoId
      );
    }
    return new NotFoundException("Video doesn't exist");
  }

  @Get(':videoId')
  // @Roles([ADMIN])
  @Public()
  async downloadLocal(
    @Request() request: any,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Param('videoId') videoId: string
  ) {
    try {
      const file = readFileSync(`${process.env["LOCAL_VIDEO_PATH"]}/` + videoId);
      if (!file) {
        return new NotFoundException("Video doesn't exist");
      }
      console.log(file);
      return res.status(200).send(file);
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
        destination: `${process.env["LOCAL_VIDEO_PATH"]}`,
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
