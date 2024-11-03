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
  Patch,
  ForbiddenException,
  BadRequestException,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { ADMIN, CREATOR, MANAGER, Roles } from '@noloback/roles'
import { ItemsService } from '@noloback/items.service'
import { SitesManagersService } from '@noloback/sites.managers.service'
import { VideoService } from '@noloback/video.service'
import {
  ItemAdminReturn,
  ItemCommonReturn,
  ItemDetailedReturn,
  ItemManagerReturn
} from '@noloback/api.returns'
import {
  ItemGiveModel,
  ItemManipulationModel
} from '@noloback/api.request.bodies'
import { FiltersGetMany } from 'models/filters-get-many'
import { LoggerService } from '@noloback/logger-lib'
import { Role } from '@noloback/prisma-client-base'
import { FileInterceptor } from '@nestjs/platform-express'
import multer = require('multer')
import { randomUUID } from 'crypto'
import { extname } from 'path'
import { UploadthingService } from '@noloback/uploadthing.service'

@Controller('items')
export class ItemsController {
  constructor (
    private readonly itemsService: ItemsService,
    private readonly sitesManagersService: SitesManagersService,
    private readonly uploadthingService: UploadthingService,
    private readonly videoService: VideoService, private loggingService: LoggerService
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
    @Query('name_contains') nameContains?: string | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined,
    @Query('name_like') nameLike?: string | undefined // Legacy support
  ): Promise<ItemCommonReturn[] | ItemAdminReturn[]> {
    if (!nameContains && nameLike) {
      nameContains = nameLike // Legacy support
    }
    const filters: FiltersGetMany = new FiltersGetMany(
      firstElem,
      lastElem,
      sort,
      order,
      ['id', 'name', 'description', 'itemType', 'createdAt'],
      'id'
    );

    const data = await this.itemsService.findAll(
      request.user.activeProfile.role,
      filters,
      nameContains,
      typeId,
      categoryId,
      createdAtGte,
      createdAtLte
    );

    // return this.itemsService.findAll(request.user.role)
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.itemsService.count(
          request.user.activeProfile.role,
          filters,
          nameContains,
          typeId,
          categoryId,
          createdAtGte,
          createdAtLte)
      })
      .status(200)
      .json(data)
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
    LoggerService.userLog(+request.user.activeProfile.id, 'GET', 'Item', +id)

    return this.itemsService.findOneDetailled(id, request.user)
  }

  @Roles([ADMIN, MANAGER])
  @Post()
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: multer.diskStorage({
        destination: `${process.env['LOCAL_PICTURE_PATH']}`,
        filename: (req, file, cb) => {
          const uuid = randomUUID()
          cb(null, `${uuid}${extname(file.originalname)}`)
        }
      })
    })
  )
  async create (
    @Request() request: any,
    @Body() item: ItemManipulationModel,
    @UploadedFile() picture: Express.Multer.File
  ): Promise<ItemCommonReturn> {
    if (request.user.activeProfile.role === Role.MANAGER && !item.siteId) {
      throw new BadRequestException('You must provide a siteId.')
    }
    if (
      item.siteId &&
      !(await this.sitesManagersService.isAllowedToModify(
        request.user,
        item.siteId
      ))
    ) {
      throw new ForbiddenException('You are not allowed to modify this site.')
    }
    const createdItem = await this.itemsService.create(item, picture)
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'CREATE',
      'Item',
      createdItem.id,
      JSON.stringify(createdItem)
    )
    return createdItem
  }

  @Roles([ADMIN, MANAGER])
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: multer.diskStorage({
        destination: `${process.env['LOCAL_PICTURE_PATH']}`,
        filename: (req, file, cb) => {
          const uuid = randomUUID()
          cb(null, `${uuid}${extname(file.originalname)}`)
        }
      })
    })
  )
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItem: ItemManipulationModel,
    @UploadedFile() picture: Express.Multer.File
  ): Promise<ItemCommonReturn> {
    return this.itemsService.update(id, updatedItem, request.user, picture)
  }

  @Roles([ADMIN])
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: multer.diskStorage({
        destination: `${process.env['LOCAL_PICTURE_PATH']}`,
        filename: (req, file, cb) => {
          const uuid = randomUUID()
          cb(null, `${uuid}${extname(file.originalname)}`)
        }
      })
    })
  )
  async patch (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() item: ItemManipulationModel,
    @UploadedFile() picture: Express.Multer.File
  ): Promise<ItemManagerReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Item',
      +id,
      JSON.stringify(request.body)
    )
    return this.itemsService.patch(id, item, picture)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<ItemCommonReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'Item',
      +id
    )
    return this.itemsService.delete(id)
  }

  @Get(':id/videos')
  async getVideos (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any
  ) {
    return this.videoService.getVideosFromItem(id, request.user)
  }

  @Post(':id/give')
  @Roles([ADMIN, MANAGER])
  async giveItem (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
    @Body() body: ItemGiveModel
  ): Promise<ItemCommonReturn> {
    return this.itemsService.giveItemToSite(id, body.siteId, request.user)
  }
}
