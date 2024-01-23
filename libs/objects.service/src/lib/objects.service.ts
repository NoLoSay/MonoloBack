import { Prisma, PrismaBaseService, Object } from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { ObjectManipulationModel } from './models/object.manipulation.models'
import {
  ObjectAdminSelect,
  ObjectCommonSelect,
  ObjectCommonReturn,
  ObjectAdminReturn
} from './models/object.api.models'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ObjectsService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async findAll (
    role: 'USER' | 'ADMIN' | 'REFERENT'
  ): Promise<ObjectCommonReturn[] | ObjectAdminReturn[]> {
    let selectOptions: Prisma.ObjectSelect

    switch (role) {
      case 'ADMIN':
        selectOptions = new ObjectAdminSelect()
        break
      default:
        selectOptions = new ObjectCommonSelect()
    }

    const objects: unknown = await this.prismaBase.object
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
        return objects as ObjectAdminReturn[]
      default:
        return objects as ObjectCommonReturn[]
    }
  }

  async findOne (
    id: number,
    role: 'USER' | 'ADMIN' | 'REFERENT'
  ): Promise<ObjectCommonReturn | ObjectAdminReturn> {
    let selectOptions: Prisma.ObjectSelect

    switch (role) {
      case 'ADMIN':
        selectOptions = new ObjectAdminSelect()
        break
      default:
        selectOptions = new ObjectCommonSelect()
    }

    const object: unknown = await this.prismaBase.object
      .findUnique({
        where: { id: id },
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new BadRequestException(e)
      })

    switch (role) {
      case 'ADMIN':
        return object as ObjectAdminReturn
      default:
        return object as ObjectCommonReturn
    }
  }

  async create (object: ObjectManipulationModel): Promise<ObjectCommonReturn> {
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

    const newObject: unknown = await this.prismaBase.object
      .create({
        data: newObjectData,
        select: new ObjectAdminSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return newObject as ObjectCommonReturn
  }

  async update (
    id: number,
    updatedObject: ObjectManipulationModel
  ): Promise<ObjectCommonReturn> {
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
    const updated: unknown = await this.prismaBase.object
      .update({
        where: { id: id },
        data: updatedObjectData
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return updated as ObjectCommonReturn
  }

  async delete (id: number): Promise<ObjectCommonReturn> {
    const deleted: unknown = (await this.prismaBase.object
      .delete({
        where: { id: id },
        select: new ObjectCommonSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      }))
      return deleted as ObjectCommonReturn
  }
}
