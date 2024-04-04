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
import {
  CountryManipulationModel,
  CountriesService,
  CountryAdminReturn,
  CountryCommonReturn
} from '@noloback/countries.service'
import { ADMIN, Roles } from '@noloback/roles'

@Controller('countries')
export class CountriesController {
  constructor (private readonly countriesService: CountriesService) {}

  @Get()
  async findAll (
    @Request() request: any
  ): Promise<CountryCommonReturn[] | CountryAdminReturn[]> {
    return this.countriesService.findAll(request.user.activeProfile.role)
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<CountryCommonReturn | CountryAdminReturn> {
    return this.countriesService.findOne(id, request.user.activeProfile.role)
  }

  @Roles([ADMIN])
  @Post()
  async create (
    @Body() country: CountryManipulationModel
  ): Promise<CountryAdminReturn> {
    return this.countriesService.create(country)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedCountry: CountryManipulationModel
  ): Promise<CountryAdminReturn> {
    return this.countriesService.update(id, updatedCountry)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (
    @Param('id', ParseIntPipe) id: number
  ): Promise<CountryAdminReturn> {
    return this.countriesService.delete(id)
  }
}
