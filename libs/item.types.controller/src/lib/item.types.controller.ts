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
  Query,
  Response,
} from '@nestjs/common';
import { ADMIN, Roles } from '@noloback/roles';
import { ItemTypesService } from '@noloback/item.types.service';
import { ItemTypeManipulationModel } from '@noloback/api.request.bodies';
import {
  ItemTypeAdminReturn,
  ItemTypeCommonReturn,
  ItemTypeDetailledReturn,
} from '@noloback/api.returns';
import { LoggerService } from '@noloback/logger-lib';
import { FiltersGetMany } from 'models/filters-get-many';

@Controller('item-types')
export class ItemTypesController {
  constructor(private readonly itemTypesService: ItemTypesService) {}

  @Get()
  async findAll(
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 1000,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('item_category_id') itemCategoryId?: number | undefined,
    @Query('name_start') nameStart?: string | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined,
  ): Promise<ItemTypeCommonReturn[] | ItemTypeAdminReturn[]> {
    const itemTypes = await this.itemTypesService.findAll(
      request.user.activeProfile.role,
      new FiltersGetMany(firstElem, lastElem, sort, order, [
        'id',
        'categoryId',
        'name',
        'createdAt',
      ]),
      itemCategoryId,
      nameStart,
      createdAtGte,
      createdAtLte,
    );
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.itemTypesService.count(
          request.user.activeProfile.role,
          itemCategoryId,
          nameStart,
          createdAtGte,
          createdAtLte,
        ),
      })
      .json(itemTypes);
  }

  @Get(':id')
  async findOne(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ItemTypeDetailledReturn | ItemTypeAdminReturn> {
    return this.itemTypesService.findOne(id, request.user.activeProfile.role);
  }

  @Roles([ADMIN])
  @Post()
  async create(
    @Body() itemTypes: ItemTypeManipulationModel,
  ): Promise<ItemTypeAdminReturn> {
    return this.itemTypesService.create(itemTypes);
  }

  @Roles([ADMIN])
  @Put(':id')
  async update(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItemType: ItemTypeManipulationModel,
  ): Promise<ItemTypeAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'ItemType',
      +id,
      JSON.stringify(request.body),
    );

    return this.itemTypesService.update(id, updatedItemType);
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ItemTypeAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'ItemType',
      +id,
    );

    return this.itemTypesService.delete(id);
  }
}
