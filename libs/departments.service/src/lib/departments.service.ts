import { PrismaBaseService, Department } from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { DepartmentManipulationModel } from './models/departmentManipulation.model'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class DepartmentsService {
  private departments: Department[] = []

  constructor (
    private prismaBase: PrismaBaseService
    //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<Department[]> {
    return await this.prismaBase.department.findMany()
  }

  async findOne (id: number): Promise<Department | null> {
    return await this.prismaBase.department.findUnique({
      where: { id: id }
    })
  }

  async create (department: DepartmentManipulationModel) {
    if (
      department.countryId === undefined ||
      department.countryId === null ||
      department.countryId <= 0
    ) {
      throw new InternalServerErrorException(
        "DepartmentId can't be null or empty"
      )
    }
    const newDepartment: Department = await this.prismaBase.department
      .create({
        data: {
          name: department.name,
          latitude: department.latitude,
          longitude: department.longitude,
          Country: {
            connect: {
              id: department.countryId
            }
          }
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException()
      })

    return {
      id: newDepartment.id,
      name: newDepartment.name
    }
  }

  async update (id: number, updatedDepartment: DepartmentManipulationModel) {
    if (
      updatedDepartment.countryId === undefined ||
      updatedDepartment.countryId === null ||
      updatedDepartment.countryId <= 0
    ) {
      throw new InternalServerErrorException(
        "DepartmentId can't be null or empty"
      )
    }
    const updated: Department = await this.prismaBase.department
      .update({
        where: { id: id },
        data: {
          name: updatedDepartment.name,
          latitude: updatedDepartment.latitude,
          longitude: updatedDepartment.longitude,
          Country: {
            connect: {
              id: updatedDepartment.countryId
            }
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException()
      })

    return {
      id: updated.id,
      name: updated.name
    }
  }

  async delete (id: number) {
    await this.prismaBase.department.delete({
      where: { id: id }
    })
  }
}
