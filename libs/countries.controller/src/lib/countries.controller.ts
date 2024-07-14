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
  Patch,
  Query,
  Response
} from '@nestjs/common'
import { CountriesService } from '@noloback/countries.service'
import { CountryManipulationModel } from '@noloback/api.request.bodies'
import { CountryAdminReturn, CountryCommonReturn } from '@noloback/api.returns'
import { ADMIN, Roles } from '@noloback/roles'
import { LoggerService } from '@noloback/logger-lib'
import { FiltersGetMany } from 'models/filters-get-many'

@Controller('countries')
export class CountriesController {
  constructor (private readonly countriesService: CountriesService) {}

  @Get()
  async findAll (
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('name_start') nameStart?: string | undefined,
    @Query('code_start') codeStart?: string | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined
  ): Promise<CountryCommonReturn[] | CountryAdminReturn[]> {
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.countriesService.count(
          request.user.activeProfile.role,
          nameStart ? nameStart : undefined,
          codeStart ? codeStart : undefined,
          createdAtGte,
          createdAtLte
        ),
      })
      .json(
        await this.countriesService.findAll(request.user.activeProfile.role, new FiltersGetMany(firstElem, lastElem, sort, order, ['id', 'name', 'code', 'longitude', 'latitude', 'createdAt']), nameStart, codeStart, createdAtGte, createdAtLte)
      );
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
