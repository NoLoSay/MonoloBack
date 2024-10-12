import { PrismaBaseService, Prisma, Role } from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { CityManipulationModel } from '@noloback/api.request.bodies'
import { CityCommonReturn, CityAdminReturn } from '@noloback/api.returns'
import { CityAdminSelect, CityCommonSelect } from '@noloback/db.calls'
import { FiltersGetMany } from 'models/filters-get-many'
import { ADMIN } from '@noloback/roles'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class CitiesService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async count(
    role: Role, 
    departmentId?: number | undefined,
    zipStart?: string | undefined,
    nameStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<number> {
    return await this.prismaBase.city.count({
      where: {
        departmentId: departmentId ? +departmentId : undefined,
        zip: zipStart ? { startsWith: zipStart, mode: 'insensitive' } : undefined,
        name: nameStart ? { startsWith: nameStart, mode: 'insensitive' } : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },

        deletedAt: role === ADMIN ? undefined : null,
        department: role === ADMIN ? undefined : { deletedAt: null, country: { deletedAt: null } }
      },
    });
  }

  async findAll (role: Role, 
    filters: FiltersGetMany,
    departmentId?: number | undefined,
    zipStart?: string | undefined,
    nameStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<CityCommonReturn[] | CityAdminReturn[]> {
    let selectOptions: Prisma.CitySelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new CityAdminSelect()
        break
      default:
        selectOptions = new CityCommonSelect()
    }

    const cities: unknown = await this.prismaBase.city
      .findMany({
        select: selectOptions,
        skip: +filters.start,
        take: +filters.end - filters.start,
        where:
        {
          departmentId: departmentId ? +departmentId : undefined,
          zip: zipStart ? { startsWith: zipStart, mode: 'insensitive' } : undefined,
          name: nameStart ? { startsWith: nameStart, mode: 'insensitive' } : undefined,
          createdAt: {
            gte: createdAtGte ? new Date(createdAtGte) : undefined,
            lte: createdAtLte ? new Date(createdAtLte) : undefined,
          },

          deletedAt: role === ADMIN ? undefined : null,
          department: role === ADMIN ? undefined : { deletedAt: null, country: { deletedAt: null } }
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
        return cities as CityAdminReturn[]
      default:
        return cities as CityCommonReturn[]
    }
  }

  async findOne (
    id: number,
    role: Role
  ): Promise<CityCommonReturn | CityAdminReturn> {
    let selectOptions: Prisma.CitySelect
    switch (role) {
      case Role.ADMIN:
        selectOptions = new CityAdminSelect()
        break
      default:
        selectOptions = new CityCommonSelect()
    }

    const cities: unknown = await this.prismaBase.city
      .findUnique({
        where:
          role === Role.ADMIN
            ? { id: +id }
            : {
                id: +id,
                deletedAt: null,
                department: { deletedAt: null, country: { deletedAt: null } }
              },
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new BadRequestException(e)
      })

    switch (role) {
      case Role.ADMIN:
        return cities as CityAdminReturn
      default:
        return cities as CityCommonReturn
    }
  }

  async create (city: CityManipulationModel): Promise<CityAdminReturn> {
    if (
      city.departmentId === undefined ||
      city.departmentId === null ||
      city.departmentId <= 0
    ) {
      throw new BadRequestException("CityId can't be null or empty")
    }
    const newCity: unknown = await this.prismaBase.city
      .create({
        data: {
          name: city.name,
          zip: city.zip,
          latitude: city.latitude,
          longitude: city.longitude,
          department: {
            connect: {
              id: +city.departmentId
            }
          }
        },
        select: new CityAdminSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return newCity as CityAdminReturn
  }

  async update (
    id: number,
    updatedCity: CityManipulationModel
  ): Promise<CityAdminReturn> {
    if (
      updatedCity.departmentId === undefined ||
      updatedCity.departmentId === null ||
      updatedCity.departmentId <= 0
    ) {
      throw new BadRequestException("CityId can't be null or empty")
    }
    const updated: unknown = await this.prismaBase.city
      .update({
        where: { id: +id },
        data: {
          name: updatedCity.name,
          zip: updatedCity.zip,
          latitude: updatedCity.latitude,
          longitude: updatedCity.longitude,
          department: {
            connect: {
              id: +updatedCity.departmentId
            }
          }
        },
        select: new CityAdminSelect()
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return updated as CityAdminReturn
  }

  async delete (id: number): Promise<CityAdminReturn> {
    const deleted: unknown = await this.prismaBase.city.update({
      where: { id: +id },
      data: { deletedAt: new Date() },
      select: new CityAdminSelect()
    })
    return deleted as CityAdminReturn
  }
}
