import { PrismaBaseService, Prisma } from '@noloback/prisma-client-base'
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { AddressManipulationModel } from '@noloback/api.request.bodies'
import { AddressAdminReturn, AddressCommonReturn } from '@noloback/api.returns'
import { AddressAdminSelect, AddressCommonSelect } from '@noloback/db.calls'
//import { LogCritiaddress } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class AddressesService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<AddressAdminReturn[]> {
    return (await this.prismaBase.address.findMany({
      select: new AddressAdminSelect()
    })) as unknown as AddressAdminReturn[]
  }

  async findOne (id: number): Promise<AddressAdminReturn> {
    const address: unknown = await this.prismaBase.address.findUnique({
      where: { id: id },
      select: new AddressAdminSelect()
    })

    if (address === null) {
      throw new NotFoundException(`Address with id ${id} not found`)
    }
    return address as AddressAdminReturn
  }

  async create (
    address: AddressManipulationModel
  ): Promise<AddressCommonReturn> {
    if (
      address.cityId === undefined ||
      address.cityId === null ||
      address.cityId <= 0
    ) {
      throw new BadRequestException("AddressId can't be null or empty")
    }
    const newAddress: AddressCommonReturn = (await this.prismaBase.address
      .create({
        data: {
          houseNumber: address.houseNumber,
          street: address.street,
          zip: address.zip,
          otherDetails: address.otherDetails,
          latitude: address.latitude,
          longitude: address.longitude,
          City: {
            connect: {
              id: address.cityId
            }
          }
        },
        select: new AddressCommonSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })) as unknown as AddressCommonReturn
    return newAddress
  }

  async update (
    id: number,
    updatedAddress: AddressManipulationModel,
    role: 'USER' | 'ADMIN' | 'MANAGER'
  ): Promise<AddressCommonReturn | AddressAdminReturn> {
    if (
      updatedAddress.cityId === undefined ||
      updatedAddress.cityId === null ||
      updatedAddress.cityId <= 0
    ) {
      throw new BadGatewayException("cityId can't be null or empty")
    }

    let selectOptions: Prisma.AddressSelect

    switch (role) {
      case 'ADMIN':
        selectOptions = new AddressAdminSelect()
        break
      default:
        selectOptions = new AddressCommonSelect()
    }

    const updated: unknown = await this.prismaBase.address
      .update({
        where: { id: id },
        data: {
          houseNumber: updatedAddress.houseNumber,
          street: updatedAddress.street,
          zip: updatedAddress.zip,
          otherDetails: updatedAddress.otherDetails,
          latitude: updatedAddress.latitude,
          longitude: updatedAddress.longitude,
          City: {
            connect: {
              id: updatedAddress.cityId
            }
          }
        },
        select: selectOptions
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
    switch (role) {
      case 'ADMIN':
        return updated as AddressAdminReturn
      default:
        return updated as AddressCommonReturn
    }
  }

  async delete (id: number) {
    await this.prismaBase.address.delete({
      where: { id: id }
    })
  }
}
