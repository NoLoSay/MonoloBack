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
  UseGuards,
  UnauthorizedException,
  Query,
  Response,
} from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { JwtAuthGuard } from '@noloback/guards';
import { Admin } from '@noloback/roles';
import {
  UserCreateModel,
  UserAdminUpdateModel,
  UserUpdateModel,
  UsersService,
  UserCommonReturn,
  UserAdminReturn,
} from '@noloback/users.service';
import { VideoService } from '@noloback/video.service';
import { PaginatedDto } from 'models/swagger/paginated-dto';

@Controller('users')
@ApiExtraModels(PaginatedDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly videoService: VideoService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10
  ): Promise<UserCommonReturn[] | UserAdminReturn[]> {
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.usersService.count(),
      })
      .status(200)
      .json(
        await this.usersService.findAll(
          request.user.role,
          +firstElem,
          +lastElem
        )
      );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.findOne(id, request.user.role);
  }

  @Admin()
  @Post()
  async create(@Body() createUserDto: UserCreateModel) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UserUpdateModel | UserAdminUpdateModel
  ) {
    if (id !== request.user.id || request.user.role !== 'ADMIN') {
      throw new UnauthorizedException();
    }
    return this.usersService.update(
      id,
      request.user.role === 'ADMIN'
        ? (updateUser as UserAdminUpdateModel)
        : (updateUser as UserUpdateModel),
      request.user.role
    );
  }

  @Admin()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/videos')
  async findItsVideos(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    console.log('request.user', request.user);
    return this.videoService.getVideosFromUser(id, request.user.role);
  }
}
