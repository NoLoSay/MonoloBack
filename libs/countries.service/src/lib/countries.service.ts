import { PrismaBaseService, Prisma, Role } from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { CountryManipulationModel } from '@noloback/api.request.bodies'
import { CountryAdminReturn, CountryCommonReturn } from '@noloback/api.returns'
import { CountryAdminSelect, CountryCommonSelect } from '@noloback/db.calls'
import { FiltersGetMany } from 'models/filters-get-many'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class CountriesService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async count(
    nameStart?: string | undefined,
    codeStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<number> {
    return await this.prismaBase.country.count({
      where: {
        name: nameStart ? { startsWith: nameStart } : undefined,
        code: codeStart ? { startsWith: codeStart } : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },
      },
    });
  }

  async findAll (
    role: Role,
    filters: FiltersGetMany,
    nameStart?: string | undefined,
    codeStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<CountryCommonReturn[] | CountryAdminReturn[]> {
    let selectOptions: Prisma.CountrySelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new CountryAdminSelect()
        break
      default:
        selectOptions = new CountryCommonSelect()
    }

    const countries = await this.prismaBase.country
      .findMany({
        skip: filters.start,
        take: filters.end - filters.start,
        select: selectOptions,
        where: {
          name: nameStart ? { startsWith: nameStart, mode: 'insensitive' } : undefined,
          code: codeStart ? { startsWith: codeStart, mode: 'insensitive' } : undefined,
          createdAt: {
            gte: createdAtGte ? new Date(createdAtGte) : undefined,
            lte: createdAtLte ? new Date(createdAtLte) : undefined,
          },

          deletedAt: role === Role.ADMIN ? undefined : null,
        },
        orderBy: {
          [filters.sort]: filters.order,
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    switch (role) {
      case Role.ADMIN:
        return countries as CountryAdminReturn[]
      default:
        return countries as CountryCommonReturn[]
    }
  }

  async findOne (
    id: number,
    role: Role
  ): Promise<CountryCommonReturn | CountryAdminReturn> {
    let selectOptions: Prisma.CountrySelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new CountryAdminSelect()
        break
      default:
        selectOptions = new CountryCommonSelect()
    }

    const country = await this.prismaBase.country
      .findUnique({
        where: { id: id, deletedAt: role === Role.ADMIN ? undefined : null },
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new BadRequestException('Country not found')
      })

    switch (role) {
      case Role.ADMIN:
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
          code: country.code,
          latitude: +(country?.latitude ?? 0),
          longitude: +(country?.longitude ?? 0)
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

  async update (
    id: number,
    updatedCountry: CountryManipulationModel
  ): Promise<CountryAdminReturn> {
    const updated: CountryAdminReturn = await this.prismaBase.country
      .update({
        where: { id: id },
        data: {
          name: updatedCountry.name,
          code: updatedCountry.code,
          latitude: +(updatedCountry.latitude ?? 0),
          longitude: +(updatedCountry.longitude ?? 0)
        },
        select: new CountryAdminSelect()
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return updated
  }

  async delete (id: number): Promise<CountryAdminReturn> {
    const deleted: CountryAdminReturn = await this.prismaBase.country
      .update({
        where: { id: id },
        data: { deletedAt: new Date() },
        select: new CountryAdminSelect()
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return deleted
  }
}
