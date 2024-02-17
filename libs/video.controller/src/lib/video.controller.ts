import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
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
import { ValdationStatus } from '@prisma/client/base';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});
const upload = multer({ storage });

@Controller('videos')
export class VideoController {
  constructor(private readonly videoservice: VideoService) {}

  @Get()
  @HttpCode(200)
  async getAllVideos(
    @Query('page') pageId: number = 0,
    @Query('amount') amount: number = 50,
    @Query('validationStatus') validationStatus?: string | undefined,
    @Query('itemId') itemId?: number | undefined
  ): Promise<string> {
    let validationStatusEnum: ValdationStatus | undefined;
    if (
      validationStatus &&
      Object.values(ValdationStatus).includes(
        validationStatus as ValdationStatus
      )
    ) {
      validationStatusEnum = validationStatus as ValdationStatus;
    }
    return JSON.parse(
      JSON.stringify(
        await this.videoservice.getAllVideos(
          +pageId,
          +amount,
          validationStatusEnum,
          itemId ? +itemId : undefined
        )
      )
    );
  }

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
