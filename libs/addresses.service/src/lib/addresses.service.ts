import { PrismaBaseService, Prisma, Role } from '@noloback/prisma-client-base'
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
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
//import { LogCritiaddress } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class AddressesService {
  constructor (
    private prismaBase: PrismaBaseService,
    private readonly httpService: HttpService //private loggingService: LoggerService
  ) {}

  async useFrenchAddressAPI (q: string | undefined) {
    if (!q) {
      throw new BadRequestException('q is required')
    }

    //convert q to string and remove spaces and special characters to avoid errors in the API call
    q = q.trim().replace(/[^a-zA-Z0-9]/g, '+')

    const rep = await firstValueFrom(
      this.httpService.get(
        `https://api-adresse.data.gouv.fr/search/?q=${q}&limit=5`
      )
    )

    console.log(rep.data.features)

    const city = await this.prismaBase.city.findFirst({
      where: {
        name: rep.data.features[0].properties.city,
        department: {
          code: rep.data.features[0].properties.context.split(',')[0]
        }
      }
    })

    if (city === null) {
      throw new NotFoundException(
        `City ${rep.data.features[0].properties.city} not found`
      )
    }

    console.log(city)

    const createdAddress = this.prismaBase.address.create({
      data: {
        houseNumber: rep.data.features[0].properties.housenumber
          ? rep.data.features[0].properties.housenumber
          : undefined,
        street: rep.data.features[0].properties.street,
        postcode: rep.data.features[0].properties.postcode,
        latitude: rep.data.features[0].geometry.coordinates[1],
        longitude: rep.data.features[0].geometry.coordinates[0],
        city: {
          connect: {
            id: city.id
          }
        }
      },
      select: new AddressCommonSelect()
    })
    return createdAddress as unknown as AddressCommonReturn
  }

  async findAll (): Promise<AddressAdminReturn[]> {
    const addresses = (await this.prismaBase.address.findMany({
      select: new AddressAdminSelect()
    })) as unknown as AddressAdminReturn[]
    addresses.forEach(address => {
      address.fullAddress = `${address.houseNumber} ${address.street}, ${address.city.postcode} ${address.city.name}, ${address.city.department.name}, ${address.city.department.country.name}`
    })
    return addresses
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
          postcode: address.postcode,
          otherDetails: address.otherDetails,
          latitude: address.latitude,
          longitude: address.longitude,
          city: {
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
    role: Role
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
      case Role.ADMIN:
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
          postcode: updatedAddress.postcode,
          otherDetails: updatedAddress.otherDetails,
          latitude: updatedAddress.latitude,
          longitude: updatedAddress.longitude,
          city: {
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
      case Role.ADMIN:
        return updated as AddressAdminReturn
      default:
        return updated as AddressCommonReturn
    }
  }

  async delete (id: number): Promise<AddressAdminReturn> {
    return (await this.prismaBase.address.update({
      where: { id: id },
      data: { deletedAt: new Date() },
      select: new AddressAdminSelect()
    })) as unknown as AddressAdminReturn
  }
}
