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
import { AddressAdminReturn } from '@noloback/api.returns';
import { AddressManipulationModel } from '@noloback/api.request.bodies';
import { AddressesService } from '@noloback/addresses.service';
import { FiltersGetMany } from 'models/filters-get-many';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Roles([ADMIN])
  @Get()
  async findAll(
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('city_id') cityId?: number | undefined,
    @Query('zip_start') zipStart?: string | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined,
  ): Promise<AddressAdminReturn[]> {
    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': await this.addressesService.count(
          cityId ? +cityId : undefined,
          zipStart ? zipStart : undefined,
          createdAtGte,
          createdAtLte,
        ),
      })
      .json(
        await this.addressesService.findAll(
          new FiltersGetMany(firstElem, lastElem, sort, order, [
            'id',
            'zip',
            'cityId',
            'street',
            'houseNumber',
            'longitude',
            'latitude',
            'createdAt',
          ]),
          cityId,
          zipStart,
          createdAtGte,
          createdAtLte,
        ),
      );
  }

  @Roles([ADMIN])
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AddressAdminReturn> {
    return this.addressesService.findOne(id);
  }

  @Roles([ADMIN])
  @Post()
  async create(@Body() addresses: AddressManipulationModel) {
    return this.addressesService.create(addresses);
  }

  @Put(':id')
  async update(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedAddress: AddressManipulationModel,
  ) {
    return this.addressesService.update(
      id,
      updatedAddress,
      request.user.activeProfile.role,
    );
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.delete(id);
  }
}
