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

@Controller('locations')
export class LocationsController {
  constructor (private readonly locationsService: LocationsService) {}

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
}
