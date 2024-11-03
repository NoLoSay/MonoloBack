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
  Response,
} from '@nestjs/common';
import { DepartmentsService } from '@noloback/departments.service';
import { DepartmentManipulationModel } from '@noloback/api.request.bodies';
import {
  DepartmentAdminReturn,
  DepartmentCommonReturn,
} from '@noloback/api.returns';
import { ADMIN, Roles } from '@noloback/roles';
import { LoggerService } from '@noloback/logger-lib';
import { FiltersGetMany } from 'models/filters-get-many';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll(
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('country_id') countryId?: number | undefined,
    @Query('name_start') nameStart?: string | undefined,
    @Query('code_start') codeStart?: string | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined,
  ): Promise<DepartmentCommonReturn[] | DepartmentAdminReturn[]> {
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.departmentsService.count(
          request.user.activeProfile.role,
          countryId ? countryId : undefined,
          nameStart ? nameStart : undefined,
          codeStart ? codeStart : undefined,
          createdAtGte,
          createdAtLte,
        ),
      })
      .json(
        await this.departmentsService.findAll(
          request.user.activeProfile.role,
          new FiltersGetMany(firstElem, lastElem, sort, order, [
            'id',
            'name',
            'code',
            'countryId',
            'longitude',
            'latitude',
            'createdAt',
          ]),
          countryId,
          nameStart,
          codeStart,
          createdAtGte,
          createdAtLte,
        ),
      );
  }

  @Get(':id')
  async findOne(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DepartmentCommonReturn | DepartmentAdminReturn> {
    LoggerService.userLog(
      +request.user.activeProfile.id,
      'GET',
      'Department',
      +id,
    );

    return this.departmentsService.findOne(id, request.user.activeProfile.role);
  }

  @Roles([ADMIN])
  @Post()
  async create(
    @Body() departments: DepartmentManipulationModel,
  ): Promise<DepartmentAdminReturn> {
    return this.departmentsService.create(departments);
  }

  @Roles([ADMIN])
  @Put(':id')
  async update(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedDepartment: DepartmentManipulationModel,
  ): Promise<DepartmentAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Department',
      +id,
      JSON.stringify(request.body),
    );

    return this.departmentsService.update(id, updatedDepartment);
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DepartmentAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'Department',
      +id,
    );

    return this.departmentsService.delete(id);
  }
}
