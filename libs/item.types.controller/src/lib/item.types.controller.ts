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
import { ADMIN, Roles } from '@noloback/roles'
import { ItemTypesService } from '@noloback/item.types.service'
import { ItemTypeManipulationModel } from '@noloback/api.request.bodies'
import { ItemTypeAdminReturn, ItemTypeCommonReturn, ItemTypeDetailledReturn } from '@noloback/api.returns'
import { LoggerService } from '@noloback/logger-lib'

@Controller('item-types')
export class ItemTypesController {
  constructor (private readonly itemTypesService: ItemTypesService) {}

  @Get()
  async findAll (@Request() request: any): Promise<ItemTypeCommonReturn[] | ItemTypeAdminReturn[]> {
    return this.itemTypesService.findAll(request.user.activeProfile.role)
  }

  @Get(':id')
  async findOne (@Request() request: any, @Param('id', ParseIntPipe) id: number): Promise<ItemTypeDetailledReturn | ItemTypeAdminReturn> {
    return this.itemTypesService.findOne(id, request.user.activeProfile.role)
  }

  @Roles([ADMIN])
  @Post()
  async create (@Body() itemTypes: ItemTypeManipulationModel): Promise<ItemTypeAdminReturn> {
    return this.itemTypesService.create(itemTypes)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedItemType: ItemTypeManipulationModel
  ): Promise<ItemTypeAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'ItemType',
      +id,
      JSON.stringify(request.body)
    );

    return this.itemTypesService.update(id, updatedItemType)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Request() request: any, @Param('id', ParseIntPipe) id: number): Promise<ItemTypeAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'ItemType',
      +id,
    );

    return this.itemTypesService.delete(id)
  }
}
