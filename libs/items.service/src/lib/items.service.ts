import { Picture, Prisma, PrismaBaseService, Role } from '@noloback/prisma-client-base'
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
import { UploadthingService } from '@noloback/uploadthing.service';
import { PicturesService } from '@noloback/pictures.service'

@Injectable()
export class ItemsService {
  constructor (
    private prismaBase: PrismaBaseService,
    private readonly picturesService: PicturesService,
    private videoService: VideoService, //private loggingService: LoggerService
    private uploadthingService: UploadthingService
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

  async patch(id: number, body: any, picture: Express.Multer.File) {
    let uploadedPicture: string | undefined = undefined;

    if (picture) {
      uploadedPicture = await this.uploadthingService.uploadFile(picture);

      body.picture = uploadedPicture;
    }

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
      },
      select: new ItemAdminSelect()
    })

    return newItem as unknown as ItemCommonReturn
  }

  async update (
    id: number,
    updatedItem: ItemManipulationModel,
    picture: Express.Multer.File
  ): Promise<ItemCommonReturn> {
    let newPicture: Picture | undefined = undefined;

    if (picture) {
      newPicture = await this.picturesService.createPicture(picture.path);
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

    return newItem as unknown as ItemCommonReturn
    // let uploadedPicture: string | undefined = undefined;

    // if (picture) {
    //   uploadedPicture = await this.uploadthingService.uploadFile(picture);
    // }

    // this.checkExistingItem(id)
    // const updatedItemData: {
    //   name: string
    //   description?: string
    //   picture?: string
    //   relatedPerson?: {
    //     connect: {
    //       id: number
    //     }
    //   }
    //   itemType?: {
    //     connect: {
    //       id: number
    //     }
    //   }
    // } = {
    //   name: updatedItem.name,
    //   description: updatedItem.description,
    //   picture: uploadedPicture
    // }

    // if (updatedItem.relatedPersonId != null) {
    //   updatedItemData.relatedPerson = {
    //     connect: {
    //       id: +updatedItem.relatedPersonId
    //     }
    //   }
    // }

    // if (updatedItem.itemTypeId != null) {
    //   updatedItemData.itemType = {
    //     connect: {
    //       id: +updatedItem.itemTypeId
    //     }
    //   }
    // }
    // const updated: unknown = await this.prismaBase.item
    //   .update({
    //     where: { id: +id },
    //     data: updatedItemData
    //   })
    //   .catch((e: Error) => {
    //     console.log(e)
    //     // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
    //     throw new InternalServerErrorException(e)
    //   })

    // return updated as ItemCommonReturn
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
