import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger/dist';
import { VideoFile } from '@noloback/models/swagger';
import { VideoService } from '@noloback/video.service';
import { JwtAuthGuard } from '@noloback/guards';
import multer = require('multer');
import { extname } from 'path';

const storage = multer.diskStorage({
  // notice you are calling the multer.diskStorage() method here, not multer()
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
const upload = multer({ storage }); //provide the return value from

@Controller('videos')
export class VideoController {
  constructor(private readonly videoservice: VideoService) {}

  @Get(':id')
  @HttpCode(200)
  async getYoutube(@Param('id') id: string): Promise<string> {
    return await this.videoservice.getYoutube(id);
  }

  @ApiBody({ type: VideoFile })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          //Calling the callback passing the random name generated with the original extension name
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
    const youtube = this.videoservice.createYoutube(user, file);

    return await youtube;
  }
}
