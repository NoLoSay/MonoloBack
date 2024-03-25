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
  ItemCategoryManipulationModel,
  ItemCategoriesService
} from '@noloback/item.categories.service'
import { ADMIN, Roles } from '@noloback/roles'

@Controller('item-categories')
export class ItemCategoriesController {
  constructor (private readonly itemCategoriesService: ItemCategoriesService) {}

  @Get()
  async findAll () {
    return this.itemCategoriesService.findAll()
  }

  @Roles([ADMIN])
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.itemCategoriesService.findOne(id)
  }

  @Roles([ADMIN])
  @Post()
  async create (@Body() itemCategory: ItemCategoryManipulationModel) {
    return this.itemCategoriesService.create(itemCategory)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItemCategory: ItemCategoryManipulationModel
  ) {
    return this.itemCategoriesService.update(id, updatedItemCategory)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.itemCategoriesService.delete(id)
  }
}
