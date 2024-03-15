import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import { Admin } from '@noloback/roles'
import {
  ItemAdminReturn,
  ItemCommonReturn,
  ItemDetailedReturn,
  ItemManipulationModel,
  ItemsService
} from '@noloback/items.service'
import { JwtAuthGuard } from '@noloback/guards'
import { LocationsReferentsService } from '@noloback/locations.referents.service'
import { VideoService } from '@noloback/video.service'

@Controller('items')
export class ItemsController {
  constructor (
    private readonly itemsService: ItemsService,
    private readonly locationsReferentsService: LocationsReferentsService,
    private readonly videoService: VideoService
  ) // private loggingService: LoggerService
  {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll (
    @Request() request: any
  ): Promise<ItemCommonReturn[] | ItemAdminReturn[]> {
    return this.itemsService.findAll(request.user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Get('video-pending')
  async findAllVideoPendingItems () {
    return this.itemsService.findAllVideoPendingItems()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any
  ): Promise<ItemDetailedReturn | ItemAdminReturn> {
    return this.itemsService.findOneDetailled(id, request.user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create (
    @Request() request: any,
    @Body() items: ItemManipulationModel
  ) {
    if (request.user.role === 'ADMIN' || request.user.role === 'REFERENT')
      return this.itemsService.create(items)
    throw new UnauthorizedException()
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItem: ItemManipulationModel
  ) {
    if (request.user.role === 'ADMIN' || request.user.role === 'REFERENT')
      return this.itemsService.update(id, updatedItem)
    throw new UnauthorizedException()
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.delete(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/videos')
  async getVideos (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any
  ) {
    return this.videoService.getVideosFromItem(id, request.user.role)
  }
}
