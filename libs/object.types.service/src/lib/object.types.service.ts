import { PrismaBaseService, ObjectType } from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ObjectTypeManipulationModel } from './models/objectTypesManipulation.model'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ObjectTypesService {
  private objectTypes: ObjectType[] = []

  constructor (
    private prismaBase: PrismaBaseService
    //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<ObjectType[]> {
    return await this.prismaBase.objectType.findMany()
  }

  async findOne (id: number): Promise<ObjectType | null> {
    return await this.prismaBase.objectType.findUnique({
      where: { id: id }
    })
  }

  async create (objectType: ObjectTypeManipulationModel) {
    if (
      objectType.objectCategoryId === undefined ||
      objectType.objectCategoryId === null ||
      objectType.objectCategoryId <= 0
    ) {
      throw new InternalServerErrorException(
        "ObjectTypeId can't be null or empty"
      )
    }
    const newObjectType: ObjectType = await this.prismaBase.objectType
      .create({
        data: {
          name: objectType.name,
          description: objectType.description,
          ObjectCategory: {
            connect: {
              id: objectType.objectCategoryId
            }
          }
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: newObjectType.id,
      name: newObjectType.name
    }
  }

  async update (id: number, updatedObjectType: ObjectTypeManipulationModel) {
    if (
      updatedObjectType.objectCategoryId === undefined ||
      updatedObjectType.objectCategoryId === null ||
      updatedObjectType.objectCategoryId <= 0
    ) {
      throw new InternalServerErrorException(
        "ObjectTypeId can't be null or empty"
      )
    }
    const updated: ObjectType = await this.prismaBase.objectType
      .update({
        where: { id: id },
        data: {
          name: updatedObjectType.name,
          description: updatedObjectType.description,
          ObjectCategory: {
            connect: {
              id: updatedObjectType.objectCategoryId
            }
          }
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
    await this.prismaBase.objectType.delete({
      where: { id: id }
    })
  }
}
