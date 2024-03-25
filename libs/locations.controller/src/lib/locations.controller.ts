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
import { ADMIN, REFERENT, Roles } from '@noloback/roles'
import {
  LocationManipulationModel,
  LocationsService
} from '@noloback/locations.service'
import {
  LocationReferentAdditionModel,
  LocationReferentModificationModel,
  LocationsReferentsService
} from '@noloback/locations.referents.service'
import { JwtAuthGuard } from '@noloback/guards'
// import { LoggerService } from '@noloback/logger-lib'

@Controller('locations')
export class LocationsController {
  constructor (
    private readonly locationsService: LocationsService,
    private readonly locationsReferentsService: LocationsReferentsService // private loggingService: LoggerService
  ) {}

  @Roles([ADMIN])
  @Get()
  async findAll () {
    return this.locationsService.findAll()
  }

  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id)
  }

  @Roles([ADMIN])
  @Post()
  async create (@Body() locations: LocationManipulationModel) {
    return this.locationsService.create(locations)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedLocation: LocationManipulationModel
  ) {
    return this.locationsService.update(id, updatedLocation)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.delete(id)
  }

  @Roles([ADMIN, REFERENT])
  @Get(':id/referents')
  async findReferents (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (
      await this.locationsReferentsService.isAllowedToModify(
        request.user.id,
        id
      )
    )
      return this.locationsReferentsService.findReferents(id)
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, REFERENT])
  @Post(':id/referents')
  async addReferent (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() referentRelationId: LocationReferentAdditionModel
  ) {
    if (
      (await this.locationsReferentsService.isAllowedToModify(
        request.user.id,
        id
      )) &&
      (await this.locationsReferentsService.isMainReferentOfLocation(
        request.user.id,
        id
      ))
    )
      return this.locationsReferentsService.addReferent(id, referentRelationId)
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, REFERENT])
  @Delete(':id/referents/:referentId')
  async deleteReferent (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('referentId', ParseIntPipe) referentId: number
  ) {
    if (
      (await this.locationsReferentsService.isAllowedToModify(
        request.user.id,
        id
      )) &&
      (await this.locationsReferentsService.isMainReferentOfLocation(
        request.user.id,
        id
      ))
    )
      return this.locationsReferentsService.deleteReferent(id, referentId)
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, REFERENT])
  @Put(':id/referents/:referentId')
  async updateReferent (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('referentId', ParseIntPipe) referentRelationId: number,
    @Body() updatedRefRelation: LocationReferentModificationModel
  ) {
    if (
      (await this.locationsReferentsService.isAllowedToModify(
        request.user.id,
        id
      )) &&
      (await this.locationsReferentsService.isMainReferentOfLocation(
        request.user.id,
        id
      ))
    )
      return this.locationsReferentsService.updateReferent(
        id,
        referentRelationId,
        updatedRefRelation
      )
    throw new UnauthorizedException()
  }
}
