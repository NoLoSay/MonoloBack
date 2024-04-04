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
import {
  DepartmentManipulationModel,
  DepartmentsService
} from '@noloback/departments.service'
import { ADMIN, Roles } from '@noloback/roles'

@Controller('departments')
export class DepartmentsController {
  constructor (private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll () {
    return this.departmentsService.findAll()
  }

  @Roles([ADMIN])
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id)
  }

  @Roles([ADMIN])
  @Post()
  async create (@Body() departments: DepartmentManipulationModel) {
    return this.departmentsService.create(departments)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedDepartment: DepartmentManipulationModel
  ) {
    return this.departmentsService.update(id, updatedDepartment)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.delete(id)
  }
}
