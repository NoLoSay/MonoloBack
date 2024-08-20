import { Prisma, PrismaBaseService, Role } from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ItemTypeManipulationModel } from '@noloback/api.request.bodies'
import {
  ItemTypeAdminReturn,
  ItemTypeCommonReturn,
  ItemTypeDetailledReturn
} from '@noloback/api.returns'
import {
  ItemTypeAdminSelect,
  ItemTypeCommonSelect,
  ItemTypeDetailledSelect
} from '@noloback/db.calls'
import { FiltersGetMany } from 'models/filters-get-many'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ItemTypesService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async findAll (
    role: Role,
    filters: FiltersGetMany,
    itemCategoryId?: number | undefined,
    nameStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<ItemTypeCommonReturn[] | ItemTypeAdminReturn[]> {
    let selectOptions: Prisma.ItemTypeSelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new ItemTypeAdminSelect()
        break
      default:
        selectOptions = new ItemTypeCommonSelect()
    }
    const types = await this.prismaBase.itemType.findMany({
      skip: +filters.start,
      take: +filters.end - filters.start,
      select: selectOptions,
      where: {
        itemCategoryId: itemCategoryId ? +itemCategoryId : undefined,
        name: nameStart ? { startsWith: nameStart, mode: 'insensitive' } : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },

        deletedAt: role === Role.ADMIN ? undefined : null,
        itemCategory: role === Role.ADMIN ? undefined : { deletedAt: null }
      },
      orderBy: {
        [filters.sort]: filters.order,
      }
    })

    switch (role) {
      case Role.ADMIN:
        return types as ItemTypeAdminReturn[]
      default:
        return types as ItemTypeCommonReturn[]
    }
  }

  async findOne (
    id: number,
    role: Role
  ): Promise<ItemTypeDetailledReturn | ItemTypeAdminReturn> {
    let selectOptions: Prisma.ItemTypeSelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new ItemTypeAdminSelect()
        break
      default:
        selectOptions = new ItemTypeDetailledSelect()
    }
    const type = await this.prismaBase.itemType
      .findUnique({
        where:
          role === Role.ADMIN
            ? { id: id }
            : { id: id, deletedAt: null, itemCategory: { deletedAt: null } },
        select: selectOptions
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiitemCategory.Critical, this.constructor.name, e)
        throw new NotFoundException('Item type not found')
      })

    switch (role) {
      case Role.ADMIN:
        return type as ItemTypeAdminReturn
      default:
        return type as ItemTypeDetailledReturn
    }
  }

  async create (
    itemType: ItemTypeManipulationModel
  ): Promise<ItemTypeAdminReturn> {
    if (
      itemType.itemCategoryId === undefined ||
      itemType.itemCategoryId === null ||
      itemType.itemCategoryId <= 0
    ) {
      throw new BadRequestException("itemCategoryId can't be null or empty")
    }
    return (await this.prismaBase.itemType
      .create({
        data: {
          name: itemType.name,
          description: itemType.description,
          itemCategory: {
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
      })) as unknown as ItemTypeAdminReturn
  }

  async update (
    id: number,
    updatedItemType: ItemTypeManipulationModel
  ): Promise<ItemTypeAdminReturn> {
    if (
      updatedItemType.itemCategoryId === undefined ||
      updatedItemType.itemCategoryId === null ||
      updatedItemType.itemCategoryId <= 0
    ) {
      throw new BadRequestException("itemCategoryId can't be null or empty")
    }
    return (await this.prismaBase.itemType
      .update({
        where: { id: id },
        data: {
          name: updatedItemType.name,
          description: updatedItemType.description,
          itemCategory: {
            connect: {
              id: updatedItemType.itemCategoryId
            }
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })) as unknown as ItemTypeAdminReturn
  }

  async delete (id: number): Promise<ItemTypeAdminReturn> {
    return (await this.prismaBase.itemType.update({
      where: { id: id },
      data: { deletedAt: new Date() }
    })) as unknown as ItemTypeAdminReturn
  }
}
