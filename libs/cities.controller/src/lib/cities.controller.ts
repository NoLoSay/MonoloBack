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
  Query,
  Response
} from '@nestjs/common'
import { CitiesService } from '@noloback/cities.service'
import { CityManipulationModel } from '@noloback/api.request.bodies'
import { CityCommonReturn, CityAdminReturn } from '@noloback/api.returns'
import { ADMIN, Roles } from '@noloback/roles'
import { LoggerService } from '@noloback/logger-lib'
import { FiltersGetMany } from 'models/filters-get-many'

@Controller('cities')
export class CitiesController {
  constructor (private readonly citiesService: CitiesService) {}

  @Get()
  async findAll (
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('department_id') departmentId?: number | undefined,
    @Query('zip_start') zipStart?: string | undefined,
    @Query('name_start') nameStart?: string | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined
  ): Promise<CityCommonReturn[] | CityAdminReturn[]> {
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.citiesService.count(
          request.user.activeProfile.role,
          departmentId ? +departmentId : undefined,
          zipStart ? zipStart : undefined,
          nameStart ? nameStart : undefined,
          createdAtGte,
          createdAtLte
        ),
      })
      .json(
        await this.citiesService.findAll(request.user.activeProfile.role, new FiltersGetMany(firstElem, lastElem, sort, order, ['id', 'zip', 'name', 'departmentId', 'longitude', 'latitude', 'createdAt']), departmentId, zipStart, nameStart, createdAtGte, createdAtLte)
      );
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    LoggerService.userLog(+request.user.activeProfile.id, 'GET', 'City', +id)

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
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedCity: CityManipulationModel
  ): Promise<CityAdminReturn> {
    LoggerService.sensitiveLog(+request.user.activeProfile.id, 'UPDATE', 'City', +id, JSON.stringify(updatedCity))

    return this.citiesService.update(id, updatedCity)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<CityAdminReturn> {
    LoggerService.sensitiveLog(+request.user.activeProfile.id, 'DELETE', 'City', +id)

    return this.citiesService.delete(id)
  }
}
