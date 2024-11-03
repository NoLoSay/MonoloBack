import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  UnauthorizedException,
  Query,
  Response,
  Patch,
} from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { ADMIN, MODERATOR, Roles } from '@noloback/roles';
import { UsersService } from '@noloback/users.service';
import { UserCreateModel, UserUpdateModel } from '@noloback/api.request.bodies';
import { UserAdminReturn, UserCommonReturn } from '@noloback/api.returns';
import { VideoService } from '@noloback/video.service';
import { PaginatedDto } from 'models/swagger/paginated-dto';
import { Role } from '@prisma/client/base';
import { LoggerService } from '@noloback/logger-lib';
import { FiltersGetMany } from 'models/filters-get-many';
import { SanctionsService } from '@noloback/sanctions.service';

@Controller('users')
@ApiExtraModels(PaginatedDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly sanctionsService: SanctionsService,
    private readonly videoService: VideoService,
  ) {}

  @Get()
  async findAll(
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('name_start') nameStart?: string | undefined,
    @Query('tel_start') telStart?: string | undefined,
    @Query('email_start') emailStart?: string | undefined,
    @Query('email_verified') emailVerified?: boolean | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined,
    @Query('deletedAt_gte') deletedAtGte?: string | undefined,
    @Query('deletedAt_lte') deletedAtLte?: string | undefined,
  ): Promise<UserCommonReturn[] | UserAdminReturn[]> {
    const data = await this.usersService.findAll(
      request.user.activeProfile.role,
      new FiltersGetMany(firstElem, lastElem, sort, order, [
        'id',
        'username',
        'telNumber',
        'email',
        'emailVerified',
        'type',
        'addressId',
        'createdAt',
        'deletedAt',
      ]),
      nameStart,
      telStart,
      emailStart,
      emailVerified,
      createdAtGte,
      createdAtLte,
      deletedAtGte,
      deletedAtLte,
    );

    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': data.length,
      })
      .status(200)
      .json(data);
  }

  @Get(':id/sanctions')
  @Roles([ADMIN, MODERATOR])
  async findOneSanctions(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.sanctionsService.getUserSanctionsById(id);
  }

  @Get('me')
  async findMe(@Request() request: any) {
    LoggerService.userLog(
      +request.user.activeProfile.id,
      'GET',
      'User',
      +request.user.activeProfile.id,
    );

    return this.usersService.findMe(request.user);
  }

  @Put('me')
  async updateMe(@Request() request: any, @Body() updateUser: UserUpdateModel) {
    return this.usersService.update(request.user.id, updateUser);
  }

  @Get(':id')
  async findOne(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    LoggerService.userLog(+request.user.activeProfile.id, 'GET', 'User', +id);

    return this.usersService.findOne(id, request.user.activeProfile.role);
  }

  @Roles([ADMIN])
  @Post()
  async create(@Body() createUserDto: UserCreateModel) {
    return this.usersService.create(createUserDto);
  }

  @Roles([ADMIN])
  @Put(':id')
  async update(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UserUpdateModel,
  ) {
    if (
      id !== request.user.id &&
      request.user.activeProfile.role !== Role.ADMIN
    ) {
      throw new UnauthorizedException();
    }
    return this.usersService.update(id, updateUser);
    // .then(() => {
    //   LoggerService.sensitiveLog(
    //     +request.user.activeProfile.id,
    //     'UPDATE',
    //     'User',
    //     id,
    //     JSON.stringify({'old': , 'new': updateUser})
    //   );
    // });
  }

  @Roles([ADMIN])
  @Patch(':id')
  async patch(@Request() request: any, @Param('id', ParseIntPipe) id: number) {
    const body = request.body;
    return this.usersService.patch(id, body);
  }

  @Delete(':id')
  async remove(@Request() request: any, @Param('id', ParseIntPipe) id: number) {
    if (
      id !== request.user.id &&
      request.user.activeProfile.role !== Role.ADMIN
    ) {
      throw new UnauthorizedException();
    }
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'User',
      +id,
    );

    return this.usersService.remove(id);
  }

  @Get(':id/videos')
  async findItsVideos(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.videoService.getVideosFromUser(id, request.user);
  }
}
