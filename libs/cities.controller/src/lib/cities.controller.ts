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
  Request
} from '@nestjs/common'
import { Admin } from '@noloback/roles'
import {
  CityManipulationModel,
  CitiesService,
  CityCommonReturn,
  CityAdminReturn
} from '@noloback/cities.service'
import { JwtAuthGuard } from '@noloback/guards'

@Controller('cities')
export class CitiesController {
  constructor (private readonly citiesService: CitiesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll (
    @Request() request: any
  ): Promise<CityCommonReturn[] | CityAdminReturn[]> {
    return this.citiesService.findAll(request.user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.citiesService.findOne(id, request.user.role)
  }

  @Admin()
  @Post()
  async create (
    @Body() cities: CityManipulationModel
  ): Promise<CityAdminReturn> {
    return this.citiesService.create(cities)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedCity: CityManipulationModel
  ): Promise<CityAdminReturn> {
    return this.citiesService.update(id, updatedCity)
  }

  @Admin()
  @Delete(':id')
  async delete (
    @Param('id', ParseIntPipe) id: number
  ): Promise<CityAdminReturn> {
    return this.citiesService.delete(id)
  }
}
