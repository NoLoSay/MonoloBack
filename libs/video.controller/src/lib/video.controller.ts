import {
  Controller,
  Get,
  Put,
  HttpCode,
  Param,
  Query,
  Request,
  Body,
  Response,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist';
import { VideoService } from '@noloback/video.service';
import { JwtAuthGuard } from '@noloback/guards';
import multer = require('multer');
import { extname } from 'path';
import { ValidationStatus } from '@prisma/client/base';

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
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 50,
    @Query('validationStatus') validationStatus?: string | undefined,
    @Query('itemId') itemId?: number | undefined
  ): Promise<string> {
    let validationStatusEnum: ValidationStatus | undefined;
    if (
      validationStatus &&
      Object.values(ValidationStatus).includes(
        validationStatus as ValidationStatus
      )
    ) {
      validationStatusEnum = validationStatus as ValidationStatus;
    }

    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.videoservice.countVideos(
          validationStatusEnum,
          itemId ? +itemId : undefined
        ),
      })
      .json(
        await this.videoservice.getAllVideos(
          +firstElem,
          +lastElem,
          validationStatusEnum,
          itemId ? +itemId : undefined
        )
      );
    // return JSON.parse(
    //   JSON.stringify(
    //     await this.videoservice.getAllVideos(
    //       +start,
    //       +end,
    //       validationStatusEnum,
    //       itemId ? +itemId : undefined
    //     )
    //   )
    // );
  }

  @Get(':uuid')
  @HttpCode(200)
  async getYoutubeByUUID(@Param('uuid') uuid: string) {
    const isnum = /^\d+$/.test(uuid);

    if (isnum) {
      return await this.videoservice.getYoutubeById(parseInt(uuid, 10));
    }
    return await this.videoservice.getYoutubeByUUID(uuid);
  }

  @Put(':uuid/validation')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        validationStatus: {
          enum: ['VALIDATED', 'PENDING', 'REFUSED'],
        },
      },
      required: ['validationStatus'],
      example: { validationStatus: 'VALIDATED' },
    },
  })
  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  async updateYoutube(
    @Request() req: any,
    @Param('uuid') uuid: string,
    @Body('validationStatus') validationStatus: ValidationStatus
  ) {
    // if (req.user.role !== 'ADMIN')
    //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    console.log(uuid, validationStatus);
    console.log(req.body);

    return await this.videoservice.updateYoutubeValidation(
      uuid,
      validationStatus
    );
  }
}
