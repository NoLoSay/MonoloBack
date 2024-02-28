import { PrismaBaseService, ItemType } from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ItemTypeManipulationModel } from './models/itemTypesManipulation.model'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ItemTypesService {
  constructor (
    private prismaBase: PrismaBaseService
    //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<ItemType[]> {
    return await this.prismaBase.itemType.findMany()
  }

  async findOne (id: number): Promise<ItemType | null> {
    return await this.prismaBase.itemType.findUnique({
      where: { id: id }
    })
  }

  async create (itemType: ItemTypeManipulationModel) {
    if (
      itemType.itemCategoryId === undefined ||
      itemType.itemCategoryId === null ||
      itemType.itemCategoryId <= 0
    ) {
      throw new InternalServerErrorException(
        "ItemTypeId can't be null or empty"
      )
    }
    const newItemType: ItemType = await this.prismaBase.itemType
      .create({
        data: {
          name: itemType.name,
          description: itemType.description,
          ItemCategory: {
            connect: {
              id: itemType.itemCategoryId
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
      id: newItemType.id,
      name: newItemType.name
    }
  }

  async update (id: number, updatedItemType: ItemTypeManipulationModel) {
    if (
      updatedItemType.itemCategoryId === undefined ||
      updatedItemType.itemCategoryId === null ||
      updatedItemType.itemCategoryId <= 0
    ) {
      throw new InternalServerErrorException(
        "ItemTypeId can't be null or empty"
      )
    }
    const updated: ItemType = await this.prismaBase.itemType
      .update({
        where: { id: id },
        data: {
          name: updatedItemType.name,
          description: updatedItemType.description,
          ItemCategory: {
            connect: {
              id: updatedItemType.itemCategoryId
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
    await this.prismaBase.itemType.delete({
      where: { id: id }
    })
  }
}
