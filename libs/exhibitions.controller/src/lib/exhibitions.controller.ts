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
  ExhibitionManipulationModel,
  ExhibitionsService
} from '@noloback/exhibitions.service'
import { ExhibitedItemsService } from '@noloback/exhibited.items.service'
import { ExhibitedItemAdditionModel } from '@noloback/exhibited.items.service'
import { JwtAuthGuard } from '@noloback/guards'
import { LocationsReferentsService } from '@noloback/locations.referents.service'
import { Exhibition } from '@prisma/client/base'

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

  @UseGuards(JwtAuthGuard)
  @Post()
  async create (
    @Request() request: any,
    @Body() exhibitions: ExhibitionManipulationModel
  ) {
    if (
      request.user.role === 'ADMIN' ||
      (request.user.role === 'REFERENT' &&
        (await this.locationsReferentsService.isReferentOfLocation(
          request.user.id,
          exhibitions.locationId
        )))
    )
      return this.exhibitionsService.create(exhibitions)
    throw new UnauthorizedException()
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedExhibition: ExhibitionManipulationModel
  ) {
    if (
      request.user.role === 'ADMIN' ||
      (request.user.role === 'REFERENT' &&
        (await this.locationsReferentsService.isReferentOfLocation(
          request.user.id,
          updatedExhibition.locationId
        )))
    )
      return this.exhibitionsService.update(id, updatedExhibition)
    throw new UnauthorizedException()
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete (@Request() request: any, @Param('id', ParseIntPipe) id: number) {
    const exhibition: Exhibition | null = await this.findOne(id)
    if (!exhibition) return null
    if (
      request.user.role === 'ADMIN' ||
      (request.user.role === 'REFERENT' &&
        (await this.locationsReferentsService.isReferentOfLocation(
          request.user.id,
          exhibition.locationId
        )))
    )
      return this.exhibitionsService.delete(id)
    throw new UnauthorizedException()
  }

  @Get(':id/items')
  async findExibitedItems (@Param('id', ParseIntPipe) id: number) {
    return this.exhibitedItemsService.findExibitedItems(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/items')
  async addExhibitedItem (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() addedItem: ExhibitedItemAdditionModel
  ) {
    const exhibition: Exhibition | null = await this.findOne(id)
    if (!exhibition) return null
    if (
      request.user.role === 'ADMIN' ||
      (request.user.role === 'REFERENT' &&
        (await this.locationsReferentsService.isReferentOfLocation(
          request.user.id,
          exhibition.locationId
        )))
    )
      return this.exhibitedItemsService.addExhibitedItem(id, addedItem)
    throw new UnauthorizedException()
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/items/:itemId')
  async deleteExhibitedItem (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number
  ) {
    const exhibition: Exhibition | null = await this.findOne(id)
    if (!exhibition) return null
    if (
      request.user.role === 'ADMIN' ||
      (request.user.role === 'REFERENT' &&
        (await this.locationsReferentsService.isReferentOfLocation(
          request.user.id,
          exhibition.locationId
        )))
    )
      return this.exhibitedItemsService.deleteExhibitedItem(id, itemId)
    throw new UnauthorizedException()
  }
}
