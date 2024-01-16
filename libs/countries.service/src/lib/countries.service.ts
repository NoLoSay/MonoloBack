import {
  PrismaBaseService,
  Country,
  Prisma
} from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CountryManipulationModel } from './models/country-manipulation.model'
import {
  CountryAdminReturn,
  CountryAdminSelect,
  CountryCommonReturn,
  CountryCommonSelect
} from './models/country.api.model'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class CountriesService {
  private countries: Country[] = []

  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async findAll (
    role: 'USER' | 'ADMIN' | 'REFERENT'
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

    switch (role) {
      case 'ADMIN':
        return countries as CountryAdminReturn[]
      default:
        return countries as CountryCommonReturn[]
    }
  }

  async findOne (
    id: number,
    role: 'USER' | 'ADMIN' | 'REFERENT'
  ): Promise<CountryCommonReturn | CountryAdminReturn | null> {
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

    if (!country) {
      return null
    }

    switch (role) {
      case 'ADMIN':
        return country as CountryAdminReturn
      default:
        return country as CountryCommonReturn
    }
  }

  async create (country: CountryManipulationModel) {
    const newCountry: Country = await this.prismaBase.country
      .create({
        data: {
          name: country.name,
          latitude: country.latitude,
          longitude: country.longitude
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: newCountry.id,
      name: newCountry.name
    }
  }

  async update (id: number, updatedCountry: CountryManipulationModel) {
    const updated: Country = await this.prismaBase.country
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

    return {
      id: updated.id,
      name: updated.name
    }
  }

  async delete (id: number) {
    await this.prismaBase.country.delete({
      where: { id: id }
    })
  }
}
