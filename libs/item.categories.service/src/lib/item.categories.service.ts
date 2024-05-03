import { Prisma, PrismaBaseService, Role } from '@noloback/prisma-client-base'
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ItemCategoryManipulationModel } from '@noloback/api.request.bodies'
import {
  ItemCategoryAdminReturn,
  ItemCategoryCommonReturn,
  ItemCategoryDetailledReturn
} from '@noloback/api.returns'
import {
  ItemCategoryAdminSelect,
  ItemCategoryCommonSelect,
  ItemCategoryDetailledSelect
} from '@noloback/db.calls'
//import { LogCritiitemCategory } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ItemCategoriesService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async findAll (
    role: Role
  ): Promise<ItemCategoryCommonReturn[] | ItemCategoryAdminReturn[]> {
    let selectOptions: Prisma.ItemCategorySelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new ItemCategoryAdminSelect()
        break
      default:
        selectOptions = new ItemCategoryCommonSelect()
    }
    const categories: unknown[] = await this.prismaBase.itemCategory.findMany({
      select: selectOptions,
      where: role === Role.ADMIN ? undefined : { deletedAt: null }
    })

    switch (role) {
      case Role.ADMIN:
        return categories as ItemCategoryAdminReturn[]
      default:
        return categories as ItemCategoryCommonReturn[]
    }
  }

  async findOne (
    id: number,
    role: Role
  ): Promise<ItemCategoryDetailledReturn | ItemCategoryAdminReturn> {
    let selectOptions: Prisma.ItemCategorySelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new ItemCategoryAdminSelect()
        break
      default:
        selectOptions = new ItemCategoryDetailledSelect()
    }
    const category: unknown = await this.prismaBase.itemCategory
      .findUnique({
        where: { id: id, deletedAt: role === Role.ADMIN ? undefined : null },
        select: selectOptions
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiitemCategory.Critical, this.constructor.name, e)
        throw new NotFoundException('Item category not found')
      })

    switch (role) {
      case Role.ADMIN:
        return category as ItemCategoryAdminReturn
      default:
        return category as ItemCategoryDetailledReturn
    }
  }

  async create (
    itemCategory: ItemCategoryManipulationModel
  ): Promise<ItemCategoryAdminReturn> {
    return (await this.prismaBase.itemCategory
      .create({
        data: {
          name: itemCategory.name,
          description: itemCategory.description
        },
        select: new ItemCategoryAdminSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiitemCategory.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })) as unknown as ItemCategoryAdminReturn
  }

  async update (
    id: number,
    updatedItemCategory: ItemCategoryManipulationModel
  ): Promise<ItemCategoryAdminReturn> {
    return (await this.prismaBase.itemCategory
      .update({
        where: { id: id },
        data: {
          name: updatedItemCategory.name,
          description: updatedItemCategory.description
        },
        select: new ItemCategoryAdminSelect()
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiitemCategory.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })) as unknown as ItemCategoryAdminReturn
  }

  async delete (id: number): Promise<ItemCategoryAdminReturn> {
    return (await this.prismaBase.itemCategory.update({
      where: { id: id },
      data: { deletedAt: new Date() }
    })) as unknown as ItemCategoryAdminReturn
  }
}
