import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request
} from '@nestjs/common'
import { Admin } from '@noloback/roles'
import {
  AddressAdminReturn,
  AddressManipulationModel,
  AddressesService
} from '@noloback/addresses.service'
import { JwtAuthGuard } from '@noloback/guards'

@Controller('addresses')
export class AddressesController {
  constructor (private readonly addressesService: AddressesService) {}

  @Admin()
  @Get()
  async findAll (): Promise<AddressAdminReturn[]> {
    return this.addressesService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (
    @Param('id', ParseIntPipe) id: number
  ): Promise<AddressAdminReturn> {
    return this.addressesService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() addresses: AddressManipulationModel) {
    return this.addressesService.create(addresses)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedAddress: AddressManipulationModel
  ) {
    return this.addressesService.update(id, updatedAddress, request.user.role)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.delete(id)
  }
}
