import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  Response,
  Query,
} from '@nestjs/common';
import { ItemCategoriesService } from '@noloback/item.categories.service';
import { ItemCategoryManipulationModel } from '@noloback/api.request.bodies';
import { ADMIN, Roles } from '@noloback/roles';
import {
  ItemCategoryAdminReturn,
  ItemCategoryCommonReturn,
} from '@noloback/api.returns';
import { LoggerService } from '@noloback/logger-lib';
import { FiltersGetMany } from 'models/filters-get-many';

@Controller('item-categories')
export class ItemCategoriesController {
  constructor(private readonly itemCategoriesService: ItemCategoriesService) {}

  @Get()
  async findAll(
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('name_start') nameStart?: string | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined,
  ): Promise<ItemCategoryCommonReturn[] | ItemCategoryAdminReturn[]> {
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.itemCategoriesService.count(
          request.user.activeProfile.role,
          nameStart ? nameStart : undefined,
          createdAtGte,
          createdAtLte,
        ),
      })
      .json(
        await this.itemCategoriesService.findAll(
          request.user.activeProfile.role,
          new FiltersGetMany(firstElem, lastElem, sort, order, [
            'id',
            'name',
            'createdAt',
          ]),
          nameStart,
          createdAtGte,
          createdAtLte,
        ),
      );
  }

  @Get(':id')
  async findOne(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ItemCategoryCommonReturn | ItemCategoryAdminReturn> {
    LoggerService.userLog(
      +request.user.activeProfile.id,
      'GET',
      'Category',
      +id,
    );

    return this.itemCategoriesService.findOne(
      id,
      request.user.activeProfile.role,
    );
  }

  @Roles([ADMIN])
  @Post()
  async create(
    @Body() itemCategory: ItemCategoryManipulationModel,
  ): Promise<ItemCategoryAdminReturn> {
    return this.itemCategoriesService.create(itemCategory);
  }

  @Roles([ADMIN])
  @Put(':id')
  async update(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItemCategory: ItemCategoryManipulationModel,
  ): Promise<ItemCategoryAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'ItemCategory',
      +id,
      JSON.stringify(request.body),
    );

    return this.itemCategoriesService.update(id, updatedItemCategory);
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ItemCategoryAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'ItemCategory',
      +id,
    );

    return this.itemCategoriesService.delete(id);
  }
}
