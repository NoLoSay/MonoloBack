import {
  Controller,
  Get,
  Put,
  HttpCode,
  Param,
  Query,
  Request,
  Body,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist';
import { VideoService } from '@noloback/video.service';
import { JwtAuthGuard } from '@noloback/guards';
import multer = require('multer');
import { extname } from 'path';
import { ValidationStatus } from '@prisma/client/base';

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
    let validationStatusEnum: ValidationStatus | undefined;
    if (
      validationStatus &&
      Object.values(ValidationStatus).includes(
        validationStatus as ValidationStatus
      )
    ) {
      validationStatusEnum = validationStatus as ValidationStatus;
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

  @Get(':uuid')
  @HttpCode(200)
  async getYoutube(@Param('uuid') uuid: string) {
    return await this.videoservice.getYoutube(uuid);
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
