import {
  PrismaBaseService,
  Object as PrismaObject
} from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ObjectManipulationModel } from './models/objectManipulation.model'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ObjectsService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<PrismaObject[]> {
    return await this.prismaBase.object.findMany()
  }

  async findOne (id: number): Promise<PrismaObject | null> {
    return await this.prismaBase.object.findUnique({
      where: { id: id }
    })
  }

  async create (object: ObjectManipulationModel) {
    const newObjectData: {
      name: string
      description: string
      RelatedPerson?: {
        connect: {
          id: number
        }
      }
      ObjectType?: {
        connect: {
          id: number
        }
      }
    } = {
      name: object.name,
      description: object.description
    }

    if (object.relatedPersonId != null) {
      newObjectData.RelatedPerson = {
        connect: {
          id: object.relatedPersonId
        }
      }
    }

    if (object.objectTypeId != null) {
      newObjectData.ObjectType = {
        connect: {
          id: object.objectTypeId
        }
      }
    }

    const newObject: PrismaObject = await this.prismaBase.object
      .create({
        data: newObjectData
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: newObject.id,
      name: newObject.name
    }
  }

  async update (id: number, updatedObject: ObjectManipulationModel) {
    const updatedObjectData: {
      name: string
      description: string
      RelatedPerson?: {
        connect: {
          id: number
        }
      }
      ObjectType?: {
        connect: {
          id: number
        }
      }
    } = {
      name: updatedObject.name,
      description: updatedObject.description
    }

    if (updatedObject.relatedPersonId != null) {
      updatedObjectData.RelatedPerson = {
        connect: {
          id: updatedObject.relatedPersonId
        }
      }
    }

    if (updatedObject.objectTypeId != null) {
      updatedObjectData.ObjectType = {
        connect: {
          id: updatedObject.objectTypeId
        }
      }
    }
    const updated: PrismaObject = await this.prismaBase.object
      .update({
        where: { id: id },
        data: updatedObjectData
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
    await this.prismaBase.object.delete({
      where: { id: id }
    })
  }
}
