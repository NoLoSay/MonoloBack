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
import { ItemCategoriesService } from '@noloback/item.categories.service'
import { ItemCategoryManipulationModel } from '@noloback/api.request.bodies'
import { ADMIN, Roles } from '@noloback/roles'
import {
  ItemCategoryAdminReturn,
  ItemCategoryCommonReturn
} from '@noloback/api.returns'

@Controller('item-categories')
export class ItemCategoriesController {
  constructor (private readonly itemCategoriesService: ItemCategoriesService) {}

  @Get()
  async findAll (
    @Request() request: any
  ): Promise<ItemCategoryCommonReturn[] | ItemCategoryAdminReturn[]> {
    return this.itemCategoriesService.findAll(request.user.activeProfile.role)
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<ItemCategoryCommonReturn | ItemCategoryAdminReturn> {
    return this.itemCategoriesService.findOne(id, request.user.activeProfile.role)
  }

  @Roles([ADMIN])
  @Post()
  async create (
    @Body() itemCategory: ItemCategoryManipulationModel
  ): Promise<ItemCategoryAdminReturn> {
    return this.itemCategoriesService.create(itemCategory)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItemCategory: ItemCategoryManipulationModel
  ): Promise<ItemCategoryAdminReturn> {
    return this.itemCategoriesService.update(id, updatedItemCategory)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (
    @Param('id', ParseIntPipe) id: number
  ): Promise<ItemCategoryAdminReturn> {
    return this.itemCategoriesService.delete(id)
  }
}
