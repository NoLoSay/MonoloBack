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
  Response,
  Query,
  Patch
} from '@nestjs/common'
import { ADMIN, CREATOR, MANAGER, Roles } from '@noloback/roles'
import { ItemsService } from '@noloback/items.service'
import { SitesManagersService } from '@noloback/sites.managers.service'
import { VideoService } from '@noloback/video.service'
import {
  ItemAdminReturn,
  ItemCommonReturn,
  ItemDetailedReturn
} from '@noloback/api.returns'
import { ItemManipulationModel } from '@noloback/api.request.bodies'
import { FiltersGetMany } from 'models/filters-get-many'
import { LoggerService } from '@noloback/logger-lib'

@Controller('items')
export class ItemsController {
  constructor (
    private readonly itemsService: ItemsService,
    private readonly sitesManagersService: SitesManagersService,
    private readonly videoService: VideoService // private loggingService: LoggerService
  ) {}

  @Get()
  async findAll (
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('type_id') typeId?: number | undefined,
    @Query('category_id') categoryId?: number | undefined,
    @Query('name_like') nameLike?: string | undefined
  ): Promise<ItemCommonReturn[] | ItemAdminReturn[]> {
    const filters: FiltersGetMany = new FiltersGetMany(
      firstElem,
      lastElem,
      sort,
      order,
      ['id', 'name', 'description', 'type', 'category'],
      'id'
    );

    // return this.itemsService.findAll(request.user.role)
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.itemsService.count(nameLike, typeId, categoryId)
      })
      .status(200)
      .json(
        await this.itemsService.findAll(
          request.user.activeProfile.role,
          filters,
          nameLike,
          typeId,
          categoryId
        )
      )
  }

  @Roles([ADMIN, CREATOR, MANAGER])
  @Get('video-pending')
  async findAllVideoPendingItems () {
    return this.itemsService.findAllVideoPendingItems()
  }

  @Get(':id')
  async findOne (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any
  ): Promise<ItemDetailedReturn | ItemAdminReturn> {
    return this.itemsService.findOneDetailled(id, request.user)
  }

  @Roles([ADMIN, MANAGER])
  @Post()
  async create (@Request() request: any, @Body() items: ItemManipulationModel) {
    return this.itemsService.create(items)
  }

  @Roles([ADMIN, MANAGER])
  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItem: ItemManipulationModel
  ) {
    return this.itemsService.update(id, updatedItem)
  }

  @Roles([ADMIN])
  @Patch(':id')
  async patch (@Request() request: any, @Param('id', ParseIntPipe) id: number) {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Item',
      +id,
      JSON.stringify(request.body)
    );

    return this.itemsService.patch(id, request.body)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Request() request: any, @Param('id', ParseIntPipe) id: number) {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'Item',
      +id
    );

    return this.itemsService.delete(id)
  }

  @Get(':id/videos')
  async getVideos (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any
  ) {
    return this.videoService.getVideosFromItem(id, request.user)
  }
}
