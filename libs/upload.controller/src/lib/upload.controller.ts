import {
  Controller,
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
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    })
  )
  async createYoutube(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<string> {
    const user = req.user;
    console.log(user);
    return 'Je suis perdu, OSECOUR !';
  }
}
