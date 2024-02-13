import { PrismaBaseService, ObjectCategory } from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ObjectCategoryManipulationModel } from './models/objectCategoriesManipulation.model'
//import { LogCritiobjectCategory } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ObjectCategoriesService {
  constructor (
    private prismaBase: PrismaBaseService
    //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<ObjectCategory[]> {
    return await this.prismaBase.objectCategory.findMany()
  }

  async findOne (id: number): Promise<ObjectCategory | null> {
    return await this.prismaBase.objectCategory.findUnique({
      where: { id: id }
    })
  }

  async create (objectCategory: ObjectCategoryManipulationModel) {
    const newObjectCategory: ObjectCategory = await this.prismaBase.objectCategory
      .create({
        data: {
          name: objectCategory.name,
          description: objectCategory.description
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiobjectCategory.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: newObjectCategory.id,
      name: newObjectCategory.name
    }
  }

  async update (id: number, updatedObjectCategory: ObjectCategoryManipulationModel) {
    const updated: ObjectCategory = await this.prismaBase.objectCategory
      .update({
        where: { id: id },
        data: {
          name: updatedObjectCategory.name,
          description: updatedObjectCategory.description
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiobjectCategory.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: updated.id,
      name: updated.name
    }
  }

  async delete (id: number) {
    await this.prismaBase.objectCategory.delete({
      where: { id: id }
    })
  }
}
