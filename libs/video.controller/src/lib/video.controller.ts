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
import { ADMIN, MODERATOR, Roles } from '@noloback/roles';

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
    @Query('createdAt_lte') createdAtLte?: string | undefined
  ): Promise<string> {
    let validationStatusEnum: ValidationStatus | undefined;
    if (
      validationStatus &&
      Object.values(ValidationStatus).includes(
        validationStatus as ValidationStatus
      )
    ) {
      validationStatusEnum = validationStatus as unknown as ValidationStatus;
    }

    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.videoservice.countVideos(
          validationStatusEnum,
          itemId ? +itemId : undefined,
          userId ? +userId : undefined,
          createdAtGte,
          createdAtLte
        ),
      })
      .json(
        await this.videoservice.getAllVideos(
          request.user,
          new FiltersGetMany(
            firstElem,
            lastElem,
            sort,
            order,
            ['id', 'validationStatus', 'createdAt'],
            'id'
          ),
          validationStatusEnum,
          itemId ? +itemId : undefined,
          userId ? +userId : undefined,
          createdAtGte,
          createdAtLte
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

  @Roles([ADMIN, MODERATOR])
  @Patch(':id')
  @HttpCode(200)
  async patchVideo(@Request() request: any, @Response() res: any) {
    return res.json(
      await this.videoservice.patchVideo(+request.params.id, request.body)
    );
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

  @Roles([ADMIN, MODERATOR])
  @Patch(':id')
  @HttpCode(200)
  async patchYoutube(
    @Request() req: any,
    @Param('id') id: number,
    @Body('validationStatus') validationStatus: ValidationStatus
  ) {
    if (req.user.role !== Role.ADMIN)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return await this.videoservice.patchYoutubeValidation(
      +id,
      validationStatus
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
    @Request() req: any,
    @Param('id') id: number,
    @Body('validationStatus') validationStatus: ValidationStatus
  ) {
    return await this.videoservice.updateYoutubeValidation(
      +id,
      validationStatus
    );
  }

  @Roles([ADMIN, MODERATOR])
  @Delete(':id')
  @HttpCode(200)
  async deleteYoutube(
    @Request() req: any,
    @Param('id') id: number,
    @Query('deletedReason') deletedReason: string
  ) {
    return await this.videoservice.deleteVideo(+id, deletedReason);
  }
}
