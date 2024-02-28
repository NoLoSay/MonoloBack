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
import { Admin } from '@noloback/roles'
import {
  DepartmentManipulationModel,
  DepartmentsService
} from '@noloback/departments.service'

@Controller('departments')
export class DepartmentsController {
  constructor (private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll () {
    return this.departmentsService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() departments: DepartmentManipulationModel) {
    return this.departmentsService.create(departments)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedDepartment: DepartmentManipulationModel
  ) {
    return this.departmentsService.update(id, updatedDepartment)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.delete(id)
  }
}
