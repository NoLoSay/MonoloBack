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
  Patch
} from '@nestjs/common'
import { CountriesService } from '@noloback/countries.service'
import { CountryManipulationModel } from '@noloback/api.request.bodies'
import { CountryAdminReturn, CountryCommonReturn } from '@noloback/api.returns'
import { ADMIN, Roles } from '@noloback/roles'
import { LoggerService } from '@noloback/logger-lib'

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
    LoggerService.userLog(+request.user.activeProfile.id, 'GET', 'Country', +id)

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
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedCountry: CountryManipulationModel
  ): Promise<CountryAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Country',
      +id,
      JSON.stringify(request.body)
    );

    return this.countriesService.update(id, updatedCountry)
  }

  @Roles([ADMIN])
  @Patch(':id')
  async patch (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedCountry: CountryManipulationModel
  ): Promise<CountryAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Country',
      +id,
      JSON.stringify(request.body)
    );

    return this.countriesService.update(id, updatedCountry)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<CountryAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'Country',
      +id,
    );

    return this.countriesService.delete(id)
  }
}
