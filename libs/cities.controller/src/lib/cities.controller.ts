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
  CityManipulationModel,
  CitiesService
} from '@noloback/cities.service'

@Controller('cities')
export class CitiesController {
  constructor (private readonly citiesService: CitiesService) {}

  @Get()
  async findAll () {
    return this.citiesService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() cities: CityManipulationModel) {
    return this.citiesService.create(cities)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedCity: CityManipulationModel
  ) {
    return this.citiesService.update(id, updatedCity)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.delete(id)
  }
}
