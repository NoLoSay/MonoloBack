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
  UseGuards
} from '@nestjs/common'
import { Admin } from '@noloback/roles'
import {
  CountryManipulationModel,
  CountriesService
} from '@noloback/countries.service'
import { JwtAuthGuard } from '@noloback/guards'

@Controller('countries')
export class CountriesController {
  constructor (private readonly countriesService: CountriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll (@Request() request: any) {
    return this.countriesService.findAll(request.user.role)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.countriesService.findOne(id, request.user.role)
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
