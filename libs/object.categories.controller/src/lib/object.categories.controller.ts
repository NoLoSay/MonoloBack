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
  ObjectCategoryManipulationModel,
  ObjectCategoriesService
} from '@noloback/object.categories.service'

@Controller('object-categories')
export class ObjectCategoriesController {
  constructor (private readonly objectCategoriesService: ObjectCategoriesService) {}

  @Get()
  async findAll () {
    return this.objectCategoriesService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.objectCategoriesService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() objectCategory: ObjectCategoryManipulationModel) {
    return this.objectCategoriesService.create(objectCategory)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedObjectCategory: ObjectCategoryManipulationModel
  ) {
    return this.objectCategoriesService.update(id, updatedObjectCategory)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.objectCategoriesService.delete(id)
  }
}
