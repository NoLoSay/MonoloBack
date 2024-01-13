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
  AddressManipulationModel,
  AddressesService
} from '@noloback/addresses.service'

@Controller('addresses')
export class AddressesController {
  constructor (private readonly addressesService: AddressesService) {}

  @Admin()
  @Get()
  async findAll () {
    return this.addressesService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() addresses: AddressManipulationModel) {
    return this.addressesService.create(addresses)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedAddress: AddressManipulationModel
  ) {
    return this.addressesService.update(id, updatedAddress)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.delete(id)
  }
}
