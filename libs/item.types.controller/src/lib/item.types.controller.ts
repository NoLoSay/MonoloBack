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
import { ADMIN, Roles } from '@noloback/roles'
import {
  ItemTypeManipulationModel,
  ItemTypesService
} from '@noloback/item.types.service'

@Controller('item-types')
export class ItemTypesController {
  constructor (private readonly itemTypesService: ItemTypesService) {}

  @Get()
  async findAll () {
    return this.itemTypesService.findAll()
  }

  @Roles([ADMIN])
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.itemTypesService.findOne(id)
  }

  @Roles([ADMIN])
  @Post()
  async create (@Body() itemTypes: ItemTypeManipulationModel) {
    return this.itemTypesService.create(itemTypes)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItemType: ItemTypeManipulationModel
  ) {
    return this.itemTypesService.update(id, updatedItemType)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.itemTypesService.delete(id)
  }
}
