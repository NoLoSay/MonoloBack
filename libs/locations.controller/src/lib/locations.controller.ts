import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe
} from '@nestjs/common'
import { Admin } from '@noloback/roles'
import {
  LocationManipulationModel,
  LocationsService
} from '@noloback/locations.service'
import { LocationReferentAdditionModel, LocationReferentModificationModel, LocationsReferentsService } from '@noloback/locations.referents.service'
// import { LoggerService } from '@noloback/logger-lib'

@Controller('locations')
export class LocationsController {
  constructor (
    private readonly locationsService: LocationsService,
    private readonly locationsReferentsService: LocationsReferentsService,
    // private loggingService: LoggerService
    ) {}

  @Admin()
  @Get()
  async findAll () {
    return this.locationsService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() locations: LocationManipulationModel) {
    return this.locationsService.create(locations)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedLocation: LocationManipulationModel
  ) {
    return this.locationsService.update(id, updatedLocation)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.delete(id)
  }

  @Admin()
  @Get(':id/referents')
  async findReferents (@Param('id', ParseIntPipe) id: number) {
    return this.locationsReferentsService.findReferents(id)
  }

  @Admin()
  @Post(':id/referents')
  async addReferent (
    @Param('id', ParseIntPipe) id: number,
    @Body() referentRelationId: LocationReferentAdditionModel
  ) {
    return this.locationsReferentsService.addReferent(id, referentRelationId)
  }

  @Admin()
  @Delete(':id/referents/:referentRelationId')
  async deleteReferent (
    @Param('id', ParseIntPipe) id: number,
    @Param('referentRelationId', ParseIntPipe) referentRelationId: number
  ) {
    return this.locationsReferentsService.deleteReferent(id, referentRelationId)
  }

  @Admin()
  @Put(':id/referents/:referentRelationId')
  async updateReferent (
    @Param('id', ParseIntPipe) id: number,
    @Param('referentRelationId', ParseIntPipe) referentRelationId: number,
    @Body() updatedRefRelation: LocationReferentModificationModel
  ) {
    return this.locationsReferentsService.updateReferent(id, referentRelationId, updatedRefRelation)
  }
}
