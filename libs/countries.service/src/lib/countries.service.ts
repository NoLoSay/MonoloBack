import {
  PrismaBaseService,
  Country,
  Prisma
} from '@noloback/prisma-client-base'
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { CountryManipulationModel } from './models/country.manipulation.models'
import {
  CountryAdminReturn,
  CountryAdminSelect,
  CountryCommonReturn,
  CountryCommonSelect
} from './models/country.api.models'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class CountriesService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async findAll (
    role: 'USER' | 'ADMIN' | 'MANAGER'
  ): Promise<CountryCommonReturn[] | CountryAdminReturn[]> {
    let selectOptions: Prisma.CountrySelect

    switch (role) {
      case 'ADMIN':
        selectOptions = new CountryAdminSelect()
        break
      default:
        selectOptions = new CountryCommonSelect()
    }

    const countries = await this.prismaBase.country.findMany({
      select: selectOptions
    })
    .catch((e: Error) => {
      console.log(e)
      // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
      throw new InternalServerErrorException(e)
    })

    switch (role) {
      case 'ADMIN':
        return countries as CountryAdminReturn[]
      default:
        return countries as CountryCommonReturn[]
    }
  }

  async findOne (
    id: number,
    role: 'USER' | 'ADMIN' | 'MANAGER'
  ): Promise<CountryCommonReturn | CountryAdminReturn> {
    let selectOptions: Prisma.CountrySelect

    switch (role) {
      case 'ADMIN':
        selectOptions = new CountryAdminSelect()
        break
      default:
        selectOptions = new CountryCommonSelect()
    }

    const country = await this.prismaBase.country.findUnique({
      where: { id },
      select: selectOptions
    })
    .catch((e: Error) => {
      console.log(e)
      // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
      throw new BadRequestException(e)
    })

    switch (role) {
      case 'ADMIN':
        return country as CountryAdminReturn
      default:
        return country as CountryCommonReturn
    }
  }

  async create (country: CountryManipulationModel): Promise<CountryAdminReturn> {
    const newCountry: CountryAdminReturn = await this.prismaBase.country
      .create({
        data: {
          name: country.name,
          latitude: country.latitude,
          longitude: country.longitude
        },
        select: new CountryAdminSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return newCountry
  }

  async update (id: number, updatedCountry: CountryManipulationModel): Promise<CountryAdminReturn> {
    const updated: CountryAdminReturn = await this.prismaBase.country
      .update({
        where: { id: id },
        data: {
          name: updatedCountry.name,
          latitude: updatedCountry.latitude,
          longitude: updatedCountry.longitude
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return updated
  }

  async delete (id: number): Promise<CountryAdminReturn> {
    const deleted: CountryAdminReturn = await this.prismaBase.country.delete({
      where: { id: id },
      select: new CountryAdminSelect()
    })
    .catch((e: Error) => {
      // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
      throw new InternalServerErrorException(e)
    })

    return deleted
  }
}
