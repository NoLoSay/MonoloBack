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
  UnauthorizedException
} from '@nestjs/common'
import { ExhibitionsService } from '@noloback/exhibitions.service'
import { ExhibitionManipulationModel, ExhibitedItemAdditionModel } from '@noloback/api.request.bodies'
import { ExhibitedItemsService } from '@noloback/exhibited.items.service'
import { ADMIN, MANAGER, Roles } from '@noloback/roles'
import { SitesManagersService } from '@noloback/sites.managers.service'
import {
  ExhibitionAdminDetailedReturn,
  ExhibitionManagerDetailedReturn,
  ExhibitionCommonDetailedReturn
} from '@noloback/api.returns'

@Controller('exhibitions')
export class ExhibitionsController {
  constructor (
    private readonly exhibitionsService: ExhibitionsService,
    private readonly exhibitedItemsService: ExhibitedItemsService,
    private readonly sitesManagersService: SitesManagersService // private loggingService: LoggerService
  ) {}

  @Get()
  async findAll (@Request() request: any, @Response() res: any) {
    return res
      .status(200)
      .json(await this.exhibitionsService.findAll(request.user))
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Response() res: any
  ) {
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
    )
      return res
        .status(200)
        .json(await this.exhibitionsService.update(id, updatedExhibition))
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
    )
      return res.status(200).json(await this.exhibitionsService.delete(id))
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
    if (!exhibition) return null
    if (
      await this.sitesManagersService.isAllowedToModify(
        request.user,
        exhibition.site.id
      )
    )
      return res
        .status(200)
        .json(await this.exhibitedItemsService.addExhibitedItem(id, addedItem))
    throw new UnauthorizedException()
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
