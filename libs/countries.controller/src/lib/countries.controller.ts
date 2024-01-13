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
  CountryManipulationModel,
  CountriesService
} from '@noloback/countries.service'

@Controller('countries')
export class CountriesController {
  constructor (private readonly countriesService: CountriesService) {}

  @Get()
  async findAll () {
    return this.countriesService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.countriesService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() country: CountryManipulationModel) {
    return this.countriesService.create(country)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedCountry: CountryManipulationModel
  ) {
    return this.countriesService.update(id, updatedCountry)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.countriesService.delete(id)
  }
}
