import {
  Picture,
  Item,
  Prisma,
  PrismaBaseService,
  Role,
  LogCriticity
} from '@noloback/prisma-client-base'
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { VideoService } from '@noloback/video.service'
import {
  ItemAdminReturn,
  ItemCommonReturn,
  ItemDetailedReturn,
  ItemManagerReturn
} from '@noloback/api.returns'
import {
  ItemAdminSelect,
  ItemCommonSelect,
  ItemDetailedSelect,
  ItemManagerSelect
} from '@noloback/db.calls'
import { ItemManipulationModel } from '@noloback/api.request.bodies'
import { UserRequestModel } from '@noloback/requests.constructor'
import { FiltersGetMany } from 'models/filters-get-many'
import { SitesManagersService } from '@noloback/sites.managers.service'
import { UploadthingService } from '@noloback/uploadthing.service';
import { PicturesService } from '@noloback/pictures.service'
import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ItemsService {
  constructor (
    private prismaBase: PrismaBaseService,
    private readonly sitesManagersService: SitesManagersService,
    private readonly picturesService: PicturesService,
    private videoService: VideoService,
    private loggingService: LoggerService,
    private uploadthingService: UploadthingService
  ) {}

  private async checkExistingItem (id: number): Promise<Item> {
    const item = await this.prismaBase.item.findUnique({
      where: { id: +id, deletedAt: null }
    })
    if (!item) throw new NotFoundException('Item not found')
    return item
  }

  private async checkExistingSite (id: number) {
    if (
      (await this.prismaBase.site.count({
        where: { id: +id, deletedAt: null }
      })) === 0
    )
      throw new NotFoundException('Site not found')
  }

  async patch (
    id: number,
    body: ItemManipulationModel, picture: Express.Multer.File
  ): Promise<ItemManagerReturn> {
    if (body.siteId) await this.checkExistingSite(body.siteId)
    let uploadedPicture: string | undefined = undefined;

    if (picture) {
      uploadedPicture = await this.uploadthingService.uploadFile(picture);

      body.picture = uploadedPicture;
    }
    return this.prismaBase.item.update({
      where: { id: +id },
      data: body,
      select: new ItemManagerSelect()
    }) as unknown as ItemManagerReturn
  }

  async count (
    role: Role,
    filters: FiltersGetMany,
    nameContains?: string,
    typeId?: number,
    categoryId?: number,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<number> {
    return await this.prismaBase.item
      .count({
        where: {
          itemType: {
            id : typeId ? +typeId : undefined,
            itemCategoryId: categoryId ? +categoryId : undefined
          },
          name: nameContains
            ? {
                contains: nameContains
              }
            : undefined,
          createdAt: {
            gte: createdAtGte ? new Date(createdAtGte) : undefined,
            lte: createdAtLte ? new Date(createdAtLte) : undefined,
          },

          deletedAt: role === Role.ADMIN ? undefined : null
        },
      })
      .catch((e: Error) => {
        console.log(e)
        this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
    }

  async findAll (
    role: Role,
    filters: FiltersGetMany,
    nameContains?: string,
    typeId?: number,
    categoryId?: number,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
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
        skip: +filters.start,
        take: +filters.end - filters.start,
        select: selectOptions,
        where: {
          itemType: {
            id : typeId ? +typeId : undefined,
            itemCategoryId: categoryId ? +categoryId : undefined
          },
          name: nameContains
            ? {
                contains: nameContains
              }
            : undefined,
          createdAt: {
            gte: createdAtGte ? new Date(createdAtGte) : undefined,
            lte: createdAtLte ? new Date(createdAtLte) : undefined,
          },

          deletedAt: role === Role.ADMIN ? undefined : null
        },
        orderBy: {
          [filters.sort]: filters.order,
        }
      })
      .catch((e: Error) => {
        console.log(e)
        this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
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
          id: +id,
          deletedAt: user.activeProfile.role === Role.ADMIN ? null : undefined
        },
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
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

  async create (item: ItemManipulationModel, picture?: Express.Multer.File): Promise<ItemCommonReturn> {
    let newPicture: Picture | undefined = undefined;

    if (picture) {
      newPicture = await this.picturesService.createPicture(picture.path);
    }

    const newItem = this.prismaBase.item.create({
      data: {
        name: item.name,
        description: item.description,
        pictures: newPicture ? {
          connect: {
            id: +newPicture?.id
          }
        } : {},
        textToTranslate: item.textToTranslate,
        relatedPerson: item.relatedPersonId ? {
          connect: {
            id: +item.relatedPersonId
          }
        } : {},
        itemType: item.itemTypeId ? {
          connect: {
            id: +item.itemTypeId
          }
        } : {},
        site: {
          connect: {
            id: +item.siteId
          }
        }
      },
      select: new ItemCommonSelect()
    })

    return newItem as unknown as ItemCommonReturn
  }

  async update (
    id: number,
    updatedItem: ItemManipulationModel,
    user: UserRequestModel,
    picture: Express.Multer.File
  ): Promise<ItemCommonReturn> {
    const item: Item = await this.checkExistingItem(id)

    let newPicture: Picture | undefined = undefined;

    if (picture) {
      newPicture = await this.picturesService.createPicture(picture.path);
    }

    if (item.siteId) {
      if (
        !(await this.sitesManagersService.isAllowedToModify(user, item.siteId))
      ) {
        throw new ForbiddenException('You are not allowed to modify this item.')
      }
    } else {
      if (user.activeProfile.role !== Role.ADMIN) {
        throw new ForbiddenException('You are not allowed to modify this item.')
      }
    }

    const newItem = this.prismaBase.item.update({
      where: {
        id: +id
      },
      data: {
        name: updatedItem.name,
        description: updatedItem.description,
        pictures: newPicture ? {
          set: {
            id: +newPicture?.id
          }
        } : {},
        textToTranslate: updatedItem.textToTranslate,
        relatedPerson: updatedItem.relatedPersonId ? {
          connect: {
            id: +updatedItem.relatedPersonId
          }
        } : {},
        itemType: updatedItem.itemTypeId ? {
          connect: {
            id: +updatedItem.itemTypeId
          }
        } : {},
      },
      select: new ItemAdminSelect()
    })

    return newItem as unknown as ItemCommonReturn;
  }

  async delete (id: number): Promise<ItemCommonReturn> {
    this.checkExistingItem(id)
    const deleted: unknown = await this.prismaBase.item
      .update({
        where: { id: +id },
        data: { deletedAt: new Date() },
        select: new ItemCommonSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
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

  async giveItemToSite (
    itemId: number,
    siteId: number,
    who: UserRequestModel
  ): Promise<ItemCommonReturn> {
    const item: Item = await this.checkExistingItem(itemId)
    await this.checkExistingSite(siteId)

    if (who.activeProfile.role !== Role.ADMIN) {
      if (
        !item.siteId ||
        !(await this.sitesManagersService.isMainManagerOfSite(who.activeProfile.id, item.siteId))
      ) {
        throw new ForbiddenException('You are not allowed to give this item.')
      }
    }

    const updatedItem: unknown = await this.prismaBase.item
      .update({
        where: { id: +itemId },
        data: {
          site: {
            connect: {
              id: +siteId
            }
          }
        }
      })
      .catch((e: Error) => {
        console.log(e)
        this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return updatedItem as ItemCommonReturn
  }
}
