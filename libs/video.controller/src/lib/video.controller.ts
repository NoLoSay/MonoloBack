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
  Patch,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist';
import { VideoService } from '@noloback/video.service';
import multer = require('multer');
import { Role, ValidationStatus } from '@prisma/client/base';
import { FiltersGetMany } from 'models/filters-get-many';
import { ADMIN, MANAGER, MODERATOR, Roles } from '@noloback/roles';
import { LoggerService } from '@noloback/logger-lib';

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
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 50,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('validationStatus') validationStatus?: string | undefined,
    @Query('item') itemId?: number | undefined,
    @Query('user') userId?: number | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined,
  ): Promise<string> {
    let validationStatusEnum: ValidationStatus | undefined;
    if (
      validationStatus &&
      Object.values(ValidationStatus).includes(
        validationStatus as ValidationStatus,
      )
    ) {
      validationStatusEnum = validationStatus as unknown as ValidationStatus;
    }

    const data = await this.videoservice.getAllVideos(
      request.user,
      new FiltersGetMany(
        firstElem,
        lastElem,
        sort,
        order,
        ['id', 'validationStatus', 'createdAt'],
        'id',
      ),
      validationStatusEnum,
      itemId ? +itemId : undefined,
      userId ? +userId : undefined,
      createdAtGte,
      createdAtLte,
    );

    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.videoservice.countVideos(
          validationStatusEnum,
          itemId ? +itemId : undefined,
          userId ? +userId : undefined,
          createdAtGte,
          createdAtLte,
        ),
      })
      .json(data);
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

  @Roles([ADMIN, MODERATOR])
  @Patch(':id')
  @HttpCode(200)
  async patchVideo(
    @Request() request: any,
    @Param('id') id: number,
    @Response() res: any,
  ) {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Video',
      +id,
      JSON.stringify(request.body),
    );

    return res.json(await this.videoservice.patchVideo(+id, request.body));
  }

  @Get(':uuid')
  @HttpCode(200)
  async getYoutubeByUUID(@Request() request: any, @Param('uuid') uuid: string) {
    LoggerService.userLog(
      +request.user.activeProfile.id,
      'GET',
      'City',
      +0,
      JSON.stringify({ uuid }),
    );

    const isnum = /^\d+$/.test(uuid);

    if (isnum) {
      return await this.videoservice.getYoutubeById(parseInt(uuid, 10));
    }
    return await this.videoservice.getYoutubeByUUID(uuid);
  }

  @Roles([ADMIN, MODERATOR])
  @Patch(':id')
  @HttpCode(200)
  async patchYoutube(
    @Request() req: any,
    @Param('id') id: number,
    @Body('validationStatus') validationStatus: ValidationStatus,
  ) {
    if (req.user.role !== Role.ADMIN)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return await this.videoservice.patchYoutubeValidation(
      +id,
      validationStatus,
    );
  }

  @Roles([ADMIN, MANAGER])
  @Put(':id/showcased')
  @HttpCode(200)
  async updateShowcased(
    @Request() request: any,
    @Param('id') id: number,
    @Body('showcased') showcased: boolean,
  ) {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Video',
      +id,
      'New showcased status: ' + showcased,
    );

    return await this.videoservice.updateVideoShowcased(
      request.user,
      +id,
      showcased,
    );
  }

  @Roles([ADMIN, MODERATOR])
  @Put(':id/validation')
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
  async updateYoutube(
    @Request() request: any,
    @Param('id') id: number,
    @Body('validationStatus') validationStatus: ValidationStatus,
  ) {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Video',
      +id,
      'New validation status: ' + validationStatus,
    );

    return await this.videoservice.updateYoutubeValidation(
      +id,
      validationStatus,
    );
  }

  @Roles([ADMIN, MODERATOR])
  @Delete(':id')
  @HttpCode(200)
  async deleteYoutube(
    @Request() request: any,
    @Param('id') id: number,
    @Query('deletedReason') deletedReason: string,
  ) {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'Video',
      +id,
    );

    return await this.videoservice.deleteVideo(+id, deletedReason);
  }
}
