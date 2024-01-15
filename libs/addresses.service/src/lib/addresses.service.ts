import { PrismaBaseService, Address } from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { AddressManipulationModel } from './models/addressManipulation.model'
//import { LogCritiaddress } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class AddressesService {
  constructor (
    private prismaBase: PrismaBaseService
    //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<Address[]> {
    return await this.prismaBase.address.findMany()
  }

  async findOne (id: number): Promise<Address | null> {
    return await this.prismaBase.address.findUnique({
      where: { id: id }
    })
  }

  async create (address: AddressManipulationModel) {
    if (
      address.cityId === undefined ||
      address.cityId === null ||
      address.cityId <= 0
    ) {
      throw new InternalServerErrorException(
        "AddressId can't be null or empty"
      )
    }
    const newAddress: Address = await this.prismaBase.address
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
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException()
      })

    return {
      houseNumber: newAddress.houseNumber,
      street: newAddress.street,
      zip: newAddress.zip,
      otherDetails: newAddress.otherDetails,
    }
  }

  async update (id: number, updatedAddress: AddressManipulationModel) {
    if (
      updatedAddress.cityId === undefined ||
      updatedAddress.cityId === null ||
      updatedAddress.cityId <= 0
    ) {
      throw new InternalServerErrorException(
        "AddressId can't be null or empty"
      )
    }
    const updated: Address = await this.prismaBase.address
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
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      houseNumber: updated.houseNumber,
      street: updated.street,
      zip: updated.zip,
      otherDetails: updated.otherDetails,
    }
  }

  async delete (id: number) {
    await this.prismaBase.address.delete({
      where: { id: id }
    })
  }
}
