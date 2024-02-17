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
  ItemCategoryManipulationModel,
  ItemCategoriesService
} from '@noloback/item.categories.service'

@Controller('item-categories')
export class ItemCategoriesController {
  constructor (private readonly itemCategoriesService: ItemCategoriesService) {}

  @Get()
  async findAll () {
    return this.itemCategoriesService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.itemCategoriesService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() itemCategory: ItemCategoryManipulationModel) {
    return this.itemCategoriesService.create(itemCategory)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItemCategory: ItemCategoryManipulationModel
  ) {
    return this.itemCategoriesService.update(id, updatedItemCategory)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.itemCategoriesService.delete(id)
  }
}
