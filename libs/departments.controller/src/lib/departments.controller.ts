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
import { DepartmentsService } from '@noloback/departments.service'
import { DepartmentManipulationModel } from '@noloback/api.request.bodies'
import {
  DepartmentAdminReturn,
  DepartmentCommonReturn
} from '@noloback/api.returns'
import { ADMIN, Roles } from '@noloback/roles'

@Controller('departments')
export class DepartmentsController {
  constructor (private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll (
    @Request() request: any
  ): Promise<DepartmentCommonReturn[] | DepartmentAdminReturn[]> {
    return this.departmentsService.findAll(request.user.activeProfile.role)
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<DepartmentCommonReturn | DepartmentAdminReturn> {
    return this.departmentsService.findOne(id, request.user.activeProfile.role)
  }

  @Roles([ADMIN])
  @Post()
  async create (
    @Body() departments: DepartmentManipulationModel
  ): Promise<DepartmentAdminReturn> {
    return this.departmentsService.create(departments)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedDepartment: DepartmentManipulationModel
  ): Promise<DepartmentAdminReturn> {
    return this.departmentsService.update(id, updatedDepartment)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (
    @Param('id', ParseIntPipe) id: number
  ): Promise<DepartmentAdminReturn> {
    return this.departmentsService.delete(id)
  }
}
