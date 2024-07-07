import { Prisma, PrismaBaseService, Role } from '@noloback/prisma-client-base'
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { VideoService } from '@noloback/video.service'
import {
  ItemAdminReturn,
  ItemCommonReturn,
  ItemDetailedReturn
} from '@noloback/api.returns'
import {
  ItemAdminSelect,
  ItemCommonSelect,
  ItemDetailedSelect
} from '@noloback/db.calls'
import { ItemManipulationModel } from '@noloback/api.request.bodies'
import { UserRequestModel } from '@noloback/requests.constructor'
import { FiltersGetMany } from 'models/filters-get-many'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ItemsService {
  constructor (
    private prismaBase: PrismaBaseService,
    private videoService: VideoService //private loggingService: LoggerService
  ) {}

  async count (nameLike: string | undefined, typeId: number | undefined, categoryId: number | undefined): Promise<number> {
    return this.prismaBase.item.count({
      where: {
        itemType: {
          id : typeId ? typeId : undefined,
          itemCategoryId: categoryId ? categoryId : undefined
        },
        name: nameLike ? {
          contains: nameLike
        } : undefined,
        deletedAt: null,
      }
    })
  }

  private async checkExistingItem (id: number) {
    if (
      (await this.prismaBase.item.count({
        where: { id: id, deletedAt: null }
      })) === 0
    )
      throw new NotFoundException('Item not found')
  }

  async patch(id: number, body: any) {
    return this.prismaBase.item.update({
      where: { id },
      data: body
    })
  }

  async findAll (
    role: Role,
    filters: FiltersGetMany,
    nameLike?: string,
    typeId?: number,
    categoryId?: number,
  ): Promise<ItemCommonReturn[] | ItemAdminReturn[]> {
    let selectOptions: Prisma.ItemSelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new ItemAdminSelect()
        break
      default:
        selectOptions = new ItemCommonSelect()
    }

    const items: unknown = await this.prismaBase.item
      .findMany({
        skip: filters.start,
        take: filters.end - filters.start,
        select: selectOptions,
        where: {
          itemType: {
            id : typeId ? typeId : undefined,
            itemCategoryId: categoryId ? categoryId : undefined
          },
          name: nameLike
            ? {
                contains: nameLike
              }
            : undefined,
          relatedPerson: categoryId ? { id: categoryId } : undefined,
          deletedAt: role === Role.ADMIN ? undefined : null
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    switch (role) {
      case Role.ADMIN:
        return items as ItemAdminReturn[]
      default:
        return items as ItemCommonReturn[]
    }
  }

  async findOneDetailled (
    id: number,
    user: UserRequestModel
  ): Promise<ItemDetailedReturn | ItemAdminReturn> {
    let selectOptions: Prisma.ItemSelect
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new ItemAdminSelect()
        break
      default:
        selectOptions = new ItemDetailedSelect(user.activeProfile.role)
    }

    const item: unknown = await this.prismaBase.item
      .findUnique({
        where: {
          id: id,
          deletedAt: user.activeProfile.role === Role.ADMIN ? null : undefined
        },
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    if (item == null) throw new NotFoundException('Item not found')
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return item as ItemAdminReturn
      default:
        return item as ItemDetailedReturn
    }
  }

  async create (item: ItemManipulationModel): Promise<ItemCommonReturn> {
    const newItemData: {
      name: string
      description?: string
      textToTranslate: string
      relatedPerson?: {
        connect: {
          id: number
        }
      }
      itemType?: {
        connect: {
          id: number
        }
      }
    } = {
      name: item.name,
      description: item.description,
      textToTranslate: item.textToTranslate
    }

    if (item.relatedPersonId != null) {
      newItemData.relatedPerson = {
        connect: {
          id: item.relatedPersonId
        }
      }
    }

    if (item.itemTypeId != null) {
      newItemData.itemType = {
        connect: {
          id: item.itemTypeId
        }
      }
    }

    const newItem: unknown = await this.prismaBase.item
      .create({
        data: newItemData,
        select: new ItemAdminSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return newItem as ItemCommonReturn
  }

  async update (
    id: number,
    updatedItem: ItemManipulationModel
  ): Promise<ItemCommonReturn> {
    this.checkExistingItem(id)
    const updatedItemData: {
      name: string
      description?: string
      relatedPerson?: {
        connect: {
          id: number
        }
      }
      itemType?: {
        connect: {
          id: number
        }
      }
    } = {
      name: updatedItem.name,
      description: updatedItem.description
    }

    if (updatedItem.relatedPersonId != null) {
      updatedItemData.relatedPerson = {
        connect: {
          id: updatedItem.relatedPersonId
        }
      }
    }

    if (updatedItem.itemTypeId != null) {
      updatedItemData.itemType = {
        connect: {
          id: updatedItem.itemTypeId
        }
      }
    }
    const updated: unknown = await this.prismaBase.item
      .update({
        where: { id: id },
        data: updatedItemData
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return updated as ItemCommonReturn
  }

  async delete (id: number): Promise<ItemCommonReturn> {
    this.checkExistingItem(id)
    const deleted: unknown = await this.prismaBase.item
      .update({
        where: { id: id },
        data: { deletedAt: new Date() },
        select: new ItemCommonSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
    return deleted as ItemCommonReturn
  }

  async findAllVideoPendingItems (): Promise<ItemCommonReturn> {
    const items: unknown = this.prismaBase.item.findMany({
      where: {
        deletedAt: null,
        videos: {
          none: {
            validationStatus: 'VALIDATED'
          }
        }
      }
    })
    return items as ItemCommonReturn
  }
}
