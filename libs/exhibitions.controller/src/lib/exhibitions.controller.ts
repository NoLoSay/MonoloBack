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
  UnauthorizedException
} from '@nestjs/common'
import {
  ExhibitionManipulationModel,
  ExhibitionsService
} from '@noloback/exhibitions.service'
import { ExhibitedItemsService } from '@noloback/exhibited.items.service'
import { ExhibitedItemAdditionModel } from '@noloback/exhibited.items.service'
import { Exhibition } from '@prisma/client/base'
import { ADMIN, REFERENT, Roles } from '@noloback/roles'
import { LocationsReferentsService } from '@noloback/locations.referents.service'

@Controller('exhibitions')
export class ExhibitionsController {
  constructor (
    private readonly exhibitionsService: ExhibitionsService,
    private readonly exhibitedItemsService: ExhibitedItemsService,
    private readonly locationsReferentsService: LocationsReferentsService // private loggingService: LoggerService
  ) {}

  @Get()
  async findAll () {
    return this.exhibitionsService.findAll()
  }

  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.exhibitionsService.findOne(id)
  }

  @Roles([ADMIN, REFERENT])
  @Post()
  async create (
    @Request() request: any,
    @Body() exhibition: ExhibitionManipulationModel
  ) {
    if (
      await this.locationsReferentsService.isAllowedToModify(
        request.user,
        exhibition.locationId
      )
    )
      return this.exhibitionsService.create(exhibition)
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, REFERENT])
  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedExhibition: ExhibitionManipulationModel
  ) {
    if (
      await this.locationsReferentsService.isAllowedToModify(
        request.user,
        updatedExhibition.locationId
      )
    )
      return this.exhibitionsService.update(id, updatedExhibition)
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, REFERENT])
  @Delete(':id')
  async delete (@Request() request: any, @Param('id', ParseIntPipe) id: number) {
    const exhibition: Exhibition | null = await this.findOne(id)
    if (!exhibition) return null
    if (
      await this.locationsReferentsService.isAllowedToModify(
        request.user,
        exhibition.locationId
      )
    )
      return this.exhibitionsService.delete(id)
    throw new UnauthorizedException()
  }

  @Get(':id/items')
  async findExibitedItems (@Param('id', ParseIntPipe) id: number) {
    return this.exhibitedItemsService.findExibitedItems(id)
  }

  @Roles([ADMIN, REFERENT])
  @Post(':id/items')
  async addExhibitedItem (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() addedItem: ExhibitedItemAdditionModel
  ) {
    const exhibition: Exhibition | null = await this.findOne(id)
    if (!exhibition) return null
    if (
      await this.locationsReferentsService.isAllowedToModify(
        request.user,
        exhibition.locationId
      )
    )
      return this.exhibitedItemsService.addExhibitedItem(id, addedItem)
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, REFERENT])
  @Delete(':id/items/:itemId')
  async deleteExhibitedItem (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number
  ) {
    const exhibition: Exhibition | null = await this.findOne(id)
    if (!exhibition) return null
    if (
      await this.locationsReferentsService.isAllowedToModify(
        request.user,
        exhibition.locationId
      )
    )
      return this.exhibitedItemsService.deleteExhibitedItem(id, itemId)
    throw new UnauthorizedException()
  }
}
