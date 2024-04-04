import { PrismaBaseService, ItemCategory } from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ItemCategoryManipulationModel } from './models/itemCategoriesManipulation.model'
//import { LogCritiitemCategory } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ItemCategoriesService {
  constructor (
    private prismaBase: PrismaBaseService
    //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<ItemCategory[]> {
    return await this.prismaBase.itemCategory.findMany()
  }

  async findOne (id: number): Promise<ItemCategory | null> {
    return await this.prismaBase.itemCategory.findUnique({
      where: { id: id }
    }).catch((e: Error) => {
      // this.loggingService.log(LogCritiitemCategory.Critical, this.constructor.name, e)
      throw new NotFoundException('Item category not found')
    })
  }

  async create (itemCategory: ItemCategoryManipulationModel) {
    const newItemCategory: ItemCategory = await this.prismaBase.itemCategory
      .create({
        data: {
          name: itemCategory.name,
          description: itemCategory.description
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiitemCategory.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: newItemCategory.id,
      name: newItemCategory.name
    }
  }

  async update (id: number, updatedItemCategory: ItemCategoryManipulationModel) {
    const updated: ItemCategory = await this.prismaBase.itemCategory
      .update({
        where: { id: id },
        data: {
          name: updatedItemCategory.name,
          description: updatedItemCategory.description
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiitemCategory.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: updated.id,
      name: updated.name
    }
  }

  async delete (id: number) {
    await this.prismaBase.itemCategory.delete({
      where: { id: id }
    })
  }
}
