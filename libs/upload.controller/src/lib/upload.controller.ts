import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@noloback/guards';
import { VideoService } from '@noloback/video.service';
import { Video } from '@prisma/client/base';
import { randomUUID } from 'crypto';
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

  @ApiBody({ type: VideoFile })
  @ApiConsumes('multipart/form-data')
  @Post(':itemId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
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
    console.log(user);
    return await this.videoService.createYoutube(user, file, itemId);
  }
}
