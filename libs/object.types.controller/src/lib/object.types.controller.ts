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
  ObjectTypeManipulationModel,
  ObjectTypesService
} from '@noloback/object.types.service'

@Controller('object-types')
export class ObjectTypesController {
  constructor (private readonly objectTypesService: ObjectTypesService) {}

  @Get()
  async findAll () {
    return this.objectTypesService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.objectTypesService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() objectTypes: ObjectTypeManipulationModel) {
    return this.objectTypesService.create(objectTypes)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedObjectType: ObjectTypeManipulationModel
  ) {
    return this.objectTypesService.update(id, updatedObjectType)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.objectTypesService.delete(id)
  }
}
