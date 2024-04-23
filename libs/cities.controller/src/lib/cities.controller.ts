import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request
} from '@nestjs/common'
import { CitiesService } from '@noloback/cities.service'
import { CityManipulationModel } from '@noloback/api.request.bodies'
import { CityCommonReturn, CityAdminReturn } from '@noloback/api.returns'
import { ADMIN, Roles } from '@noloback/roles'

@Controller('cities')
export class CitiesController {
  constructor (private readonly citiesService: CitiesService) {}

  @Get()
  async findAll (
    @Request() request: any
  ): Promise<CityCommonReturn[] | CityAdminReturn[]> {
    return this.citiesService.findAll(request.user.activeProfile.role)
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.citiesService.findOne(id, request.user.activeProfile.role)
  }

  @Roles([ADMIN])
  @Post()
  async create (
    @Body() cities: CityManipulationModel
  ): Promise<CityAdminReturn> {
    return this.citiesService.create(cities)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedCity: CityManipulationModel
  ): Promise<CityAdminReturn> {
    return this.citiesService.update(id, updatedCity)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (
    @Param('id', ParseIntPipe) id: number
  ): Promise<CityAdminReturn> {
    return this.citiesService.delete(id)
  }
}
