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
} from '@nestjs/common';
import { JwtAuthGuard } from '@noloback/guards';
import { Admin } from '@noloback/roles';
import {
  UserCreateModel,
  UserAdminUpdateModel,
  UserUpdateModel,
  UsersService,
} from '@noloback/users.service';
import { VideoService } from '@noloback/video.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly videoService: VideoService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Request() request: any,
    @Query('_start') firstElem: number = 10,
    @Query('_end') lastElem: number = 1
  ) {
    return this.usersService.findAll(request.user.role, +firstElem, +lastElem);
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
    return this.videoService.getVideosFromUser(id, request.user.role);
  }
}
