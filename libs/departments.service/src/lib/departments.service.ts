import { PrismaBaseService, Prisma, Role } from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { DepartmentManipulationModel } from '@noloback/api.request.bodies'
import {
  DepartmentAdminReturn,
  DepartmentCommonReturn
} from '@noloback/api.returns'
import {
  DepartmentAdminSelect,
  DepartmentCommonSelect
} from '@noloback/db.calls'
import { FiltersGetMany } from 'models/filters-get-many'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class DepartmentsService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async count(
    role: Role,
    countryId?: number | undefined,
    nameStart?: string | undefined,
    codeStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<number> {
    return await this.prismaBase.department.count({
      where: {
        countryId: countryId ? +countryId : undefined,
        name: nameStart ? { startsWith: nameStart, mode: 'insensitive' } : undefined,
        code: codeStart ? { startsWith: codeStart, mode: 'insensitive' } : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },

        deletedAt: role === Role.ADMIN ? undefined : null,
      },
    });
  }

  async findAll (
    role: Role,
    filters: FiltersGetMany,
    countryId?: number | undefined,
    nameStart?: string | undefined,
    codeStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<DepartmentCommonReturn[] | DepartmentAdminReturn[]> {
    let selectOptions: Prisma.DepartmentSelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new DepartmentAdminSelect()
        break
      default:
        selectOptions = new DepartmentCommonSelect()
    }
    const departments: unknown[] = await this.prismaBase.department
      .findMany({
        skip: filters.start,
        take: filters.end - filters.start,
        select: selectOptions,
        where: {
          countryId: countryId ? +countryId : undefined,
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
        return departments as DepartmentAdminReturn[]
      default:
        return departments as DepartmentCommonReturn[]
    }
  }

  async findOne (
    id: number,
    role: Role
  ): Promise<DepartmentCommonReturn | DepartmentAdminReturn> {
    let selectOptions: Prisma.DepartmentSelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new DepartmentAdminSelect()
        break
      default:
        selectOptions = new DepartmentCommonSelect()
    }
    const department: unknown = await this.prismaBase.department
      .findUnique({
        where:
          role === Role.ADMIN
            ? { id: id }
            : {
                id: id,
                deletedAt: null,
                country: { deletedAt: null }
              },
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new BadRequestException('Department not found')
      })
    switch (role) {
      case Role.ADMIN:
        return department as DepartmentAdminReturn
      default:
        return department as DepartmentCommonReturn
    }
  }

  async create (
    department: DepartmentManipulationModel
  ): Promise<DepartmentAdminReturn> {
    if (
      department.countryId === undefined ||
      department.countryId === null ||
      department.countryId <= 0
    ) {
      throw new BadRequestException("DepartmentId can't be null or empty")
    }
    const newDepartment: DepartmentAdminReturn =
      await this.prismaBase.department
        .create({
          data: {
            name: department.name,
            code: department.code,
            latitude: department.latitude,
            longitude: department.longitude,
            country: {
              connect: {
                id: department.countryId
              }
            }
          },
          select: new DepartmentAdminSelect()
        })
        .catch((e: Error) => {
          console.log(e)
          // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
          throw new InternalServerErrorException(e)
        })

    return newDepartment
  }

  async update (
    id: number,
    updatedDepartment: DepartmentManipulationModel
  ): Promise<DepartmentAdminReturn> {
    if (
      updatedDepartment.countryId === undefined ||
      updatedDepartment.countryId === null ||
      updatedDepartment.countryId <= 0
    ) {
      throw new BadRequestException("DepartmentId can't be null or empty")
    }
    const updated: DepartmentAdminReturn = await this.prismaBase.department
      .update({
        where: { id: id },
        data: {
          name: updatedDepartment.name,
          code: updatedDepartment.code,
          latitude: updatedDepartment.latitude,
          longitude: updatedDepartment.longitude,
          country: {
            connect: {
              id: updatedDepartment.countryId
            }
          }
        },
        select: new DepartmentAdminSelect()
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return updated
  }

  async delete (id: number): Promise<DepartmentAdminReturn> {
    return (await this.prismaBase.department
      .update({
        where: { id: id },
        select: new DepartmentAdminSelect(),
        data: { deletedAt: new Date() }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })) as DepartmentAdminReturn
  }
}
