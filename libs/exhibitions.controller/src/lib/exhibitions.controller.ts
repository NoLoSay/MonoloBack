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
  UnauthorizedException,
  Query,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { ExhibitionsService } from '@noloback/exhibitions.service'
import {
  ExhibitionManipulationModel,
  ExhibitedItemAdditionModel
} from '@noloback/api.request.bodies'
import { ExhibitedItemsService } from '@noloback/exhibited.items.service'
import { ADMIN, MANAGER, Roles } from '@noloback/roles'
import { SitesManagersService } from '@noloback/sites.managers.service'
import {
  ExhibitionAdminDetailedReturn,
  ExhibitionManagerDetailedReturn,
  ExhibitionCommonDetailedReturn
} from '@noloback/api.returns'
import { LoggerService } from '@noloback/logger-lib'
import { FiltersGetMany } from 'models/filters-get-many'

@Controller('exhibitions')
export class ExhibitionsController {
  constructor (
    private readonly exhibitionsService: ExhibitionsService,
    private readonly exhibitedItemsService: ExhibitedItemsService,
    private readonly sitesManagersService: SitesManagersService, private loggingService: LoggerService
  ) {}

  @Get()
  async findAll (@Request() request: any, @Response() res: any,
  @Query('_start') firstElem: number = 0,
  @Query('_end') lastElem: number = 10,
  @Query('_sort') sort?: string | undefined,
  @Query('_order') order?: 'asc' | 'desc' | undefined,
  @Query('site_id') siteId?: number | undefined,
  @Query('name_start') nameStart?: string | undefined,
  @Query('createdAt_gte') createdAtGte?: string | undefined,
  @Query('createdAt_lte') createdAtLte?: string | undefined) {
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.exhibitionsService.count(
          siteId ? siteId : undefined,
          nameStart ? nameStart : undefined,
          createdAtGte,
          createdAtLte
        ),
      })
      .json(
        await this.exhibitionsService.findAll(request.user, new FiltersGetMany(firstElem, lastElem, sort, order, ['id', 'name', 'siteId', 'longitude', 'latitude', 'createdAt']), siteId, nameStart, createdAtGte, createdAtLte)
      );
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Response() res: any
  ) {
    LoggerService.userLog(
      +request.user.activeProfile.id,
      'GET',
      'Exhibition',
      +id
    )

    return res
      .status(200)
      .json(await this.exhibitionsService.findOne(id, request.user))
  }

  @Roles([ADMIN, MANAGER])
  @Post()
  async create (
    @Request() request: any,
    @Response() res: any,
    @Body() exhibition: ExhibitionManipulationModel
  ) {
    if (
      await this.sitesManagersService.isAllowedToModify(
        request.user,
        exhibition.siteId
      )
    )
      return res
        .status(200)
        .json(await this.exhibitionsService.create(exhibition))
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, MANAGER])
  @Put(':id')
  async update (
    @Request() request: any,
    @Response() res: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedExhibition: ExhibitionManipulationModel
  ) {
    if (
      await this.sitesManagersService.isAllowedToModify(
        request.user,
        updatedExhibition.siteId
      )
    ) {
      LoggerService.sensitiveLog(
        +request.user.activeProfile.id,
        'UPDATE',
        'Exhibition',
        +id,
        JSON.stringify(request.body)
      )

      return res
        .status(200)
        .json(await this.exhibitionsService.update(id, updatedExhibition))
    }
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, MANAGER])
  @Delete(':id')
  async delete (
    @Request() request: any,
    @Response() res: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    const exhibition:
      | ExhibitionAdminDetailedReturn
      | ExhibitionManagerDetailedReturn
      | ExhibitionCommonDetailedReturn = await this.exhibitionsService.findOne(
      id,
      request.user
    )
    if (!exhibition) return null
    if (
      await this.sitesManagersService.isAllowedToModify(
        request.user,
        exhibition.site.id
      )
    ) {
      LoggerService.sensitiveLog(
        +request.user.activeProfile.id,
        'DELETE',
        'Exhibition',
        +id,
        JSON.stringify(request.body)
      )

      return res.status(200).json(await this.exhibitionsService.delete(id))
    }
    throw new UnauthorizedException()
  }

  @Get(':id/items')
  async findExibitedItems (
    @Response() res: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return res
      .status(200)
      .json(await this.exhibitedItemsService.findExibitedItems(id))
  }

  @Roles([ADMIN, MANAGER])
  @Post(':id/items')
  async addExhibitedItem (
    @Request() request: any,
    @Response() res: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() addedItem: ExhibitedItemAdditionModel
  ) {
    const exhibition = await this.exhibitionsService.findOne(id, request.user)
    if (!exhibition) throw new NotFoundException('Exhibition not found.')
    if (
      !(await this.sitesManagersService.isAllowedToModify(
        request.user,
        exhibition.site.id
      ))
    )
      throw new UnauthorizedException("You can't modify this exhibition.")
    if (
      !(await this.exhibitedItemsService.canItemBeUsedInExhibition(
        addedItem.itemId,
        id
      ))
    )
      throw new BadRequestException('Item not linked to the exhibition site.')
    return res
      .status(200)
      .json(await this.exhibitedItemsService.addExhibitedItem(id, addedItem))
  }

  @Roles([ADMIN, MANAGER])
  @Delete(':id/items/:itemId')
  async deleteExhibitedItem (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number
  ) {
    const exhibition = await this.exhibitionsService.findOne(id, request.user)
    if (!exhibition) return null
    if (
      await this.sitesManagersService.isAllowedToModify(
        request.user,
        exhibition.site.id
      )
    )
      return this.exhibitedItemsService.deleteExhibitedItem(id, itemId)
    throw new UnauthorizedException()
  }
}
