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
  Response
} from '@nestjs/common'
import { ApiExtraModels } from '@nestjs/swagger'
import { ADMIN, Roles } from '@noloback/roles'
import {
  UserCreateModel,
  UserUpdateModel,
  UsersService
} from '@noloback/users.service'
import { UserAdminReturn, UserCommonReturn } from '@noloback/api.returns'
import { VideoService } from '@noloback/video.service'
import { PaginatedDto } from 'models/swagger/paginated-dto'
import { Role } from '@prisma/client/base'

@Controller('users')
@ApiExtraModels(PaginatedDto)
export class UsersController {
  constructor (
    private readonly usersService: UsersService,
    private readonly videoService: VideoService
  ) {}

  @Get()
  async findAll (
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10
  ): Promise<UserCommonReturn[] | UserAdminReturn[]> {
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.usersService.count()
      })
      .status(200)
      .json(
        await this.usersService.findAll(
          request.user.activeProfile.role,
          +firstElem,
          +lastElem
        )
      )
  }

  @Get('me')
  async findMe (@Request() request: any) {
    return this.usersService.findMe(request.user)
  }

  @Put('me')
  async updateMe (@Request() request: any, @Body() updateUser: UserUpdateModel) {
    return this.usersService.update(request.user.id, updateUser)
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.findOne(id, request.user.activeProfile.role)
  }

  @Roles([ADMIN])
  @Post()
  async create (@Body() createUserDto: UserCreateModel) {
    return this.usersService.create(createUserDto)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UserUpdateModel
  ) {
    if (id !== request.user.id && request.user.activeProfile.role !== Role.ADMIN) {
      throw new UnauthorizedException()
    }
    return this.usersService.update(id, updateUser)
  }

  @Delete(':id')
  async remove (@Request() request: any, @Param('id', ParseIntPipe) id: number) {
    if (id !== request.user.id && request.user.activeProfile.role !== Role.ADMIN) {
      throw new UnauthorizedException()
    }
    return this.usersService.remove(id)
  }

  @Get(':id/videos')
  async findItsVideos (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.videoService.getVideosFromUser(id, request.user)
  }
}
