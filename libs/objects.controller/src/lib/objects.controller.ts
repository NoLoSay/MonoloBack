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
  ObjectManipulationModel,
  ObjectsService
} from '@noloback/objects.service'

@Controller('objects')
export class ObjectsController {
  constructor (private readonly objectsService: ObjectsService) {}

  @Get()
  async findAll () {
    return this.objectsService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.objectsService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() objects: ObjectManipulationModel) {
    return this.objectsService.create(objects)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedObject: ObjectManipulationModel
  ) {
    return this.objectsService.update(id, updatedObject)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.objectsService.delete(id)
  }
}
