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
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class DepartmentsService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async findAll (
    role: Role
  ): Promise<DepartmentCommonReturn[] | DepartmentAdminReturn[]> {
    let selectOptions: Prisma.DepartmentSelect

    switch (role) {
      case 'ADMIN':
        selectOptions = new DepartmentAdminSelect()
        break
      default:
        selectOptions = new DepartmentCommonSelect()
    }
    const departments: unknown[] = await this.prismaBase.department
      .findMany({
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
    switch (role) {
      case 'ADMIN':
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
      case 'ADMIN':
        selectOptions = new DepartmentAdminSelect()
        break
      default:
        selectOptions = new DepartmentCommonSelect()
    }
    const department: unknown = await this.prismaBase.department
      .findUnique({
        where: { id: id },
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new BadRequestException('Department not found')
      })
    switch (role) {
      case 'ADMIN':
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
      throw new InternalServerErrorException(
        "DepartmentId can't qsdqsdqsd be null or empty"
      )
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
      throw new InternalServerErrorException(
        "DepartmentI dqsdqdqsd can't be null or empty"
      )
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
      .delete({
        where: { id: id },
        select: new DepartmentAdminSelect()
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })) as DepartmentAdminReturn
  }
}
