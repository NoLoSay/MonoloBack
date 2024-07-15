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
  Query
} from '@nestjs/common'
import { ADMIN, Roles } from '@noloback/roles'
import { AddressAdminReturn } from '@noloback/api.returns'
import { AddressManipulationModel } from '@noloback/api.request.bodies'
import { AddressesService } from '@noloback/addresses.service'

@Controller('addresses')
export class AddressesController {
  constructor (private readonly addressesService: AddressesService) {}

  @Roles([ADMIN])
  @Get()
  async findAll (): Promise<AddressAdminReturn[]> {
    return this.addressesService.findAll()
  }

    @Roles([ADMIN])
    @Get('use-french-address-api')
    async useFrenchAddressAPI (
      @Query('q') query?: string | undefined
      ) {
      console.log("query: ", query)
      return this.addressesService.useFrenchAddressAPI(query)
    }

  @Roles([ADMIN])
  @Get(':id')
  async findOne (
    @Param('id', ParseIntPipe) id: number
  ): Promise<AddressAdminReturn> {
    return this.addressesService.findOne(id)
  }

  @Roles([ADMIN])
  @Post()
  async create (@Body() addresses: AddressManipulationModel) {
    return this.addressesService.create(addresses)
  }

  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedAddress: AddressManipulationModel
  ) {
    return this.addressesService.update(
      id,
      updatedAddress,
      request.user.activeProfile.role
    )
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.delete(id)
  }
}
