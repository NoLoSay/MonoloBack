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
import { ValdationStatus } from '@prisma/client/base';

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
    @Body('validationStatus') validationStatus: ValdationStatus
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
