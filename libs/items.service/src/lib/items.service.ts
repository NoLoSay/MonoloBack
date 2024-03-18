import { Prisma, PrismaBaseService } from '@noloback/prisma-client-base';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ItemManipulationModel } from './models/item.manipulation.models';
import {
  ItemAdminSelect,
  ItemCommonSelect,
  ItemCommonReturn,
  ItemAdminReturn,
  ItemDetailedReturn,
  ItemDetailedSelect,
} from './models/item.api.models';
import { VideoService } from '@noloback/video.service';
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ItemsService {
  constructor(
    private prismaBase: PrismaBaseService,
    private videoService: VideoService //private loggingService: LoggerService
  ) {}

  async count(): Promise<number> {
    return this.prismaBase.item.count();
  }

  async findAll(
    role: 'USER' | 'ADMIN' | 'REFERENT',
    firstElem: number,
    lastElem: number,
    nameLike: string | undefined
  ): Promise<ItemCommonReturn[] | ItemAdminReturn[]> {
    let selectOptions: Prisma.ItemSelect;

    switch (role) {
      case 'ADMIN':
        selectOptions = new ItemAdminSelect();
        break;
      default:
        selectOptions = new ItemCommonSelect();
    }

    const items: unknown = await this.prismaBase.item
      .findMany({
        skip: firstElem,
        take: lastElem - firstElem,
        select: selectOptions,
        where: nameLike
          ? {
              name: {
                contains: nameLike,
              },
            }
          : undefined,
      })
      .catch((e: Error) => {
        console.log(e);
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e);
      });

    switch (role) {
      case 'ADMIN':
        return items as ItemAdminReturn[];
      default:
        return items as ItemCommonReturn[];
    }
  }

  async findOneDetailled(
    id: number,
    role: 'USER' | 'ADMIN' | 'REFERENT'
  ): Promise<ItemDetailedReturn | ItemAdminReturn> {
    let selectOptions: Prisma.ItemSelect;
    switch (role) {
      case 'ADMIN':
        selectOptions = new ItemAdminSelect();
        break;
      default:
        selectOptions = new ItemDetailedSelect(role);
    }

    const item: unknown = await this.prismaBase.item
      .findUnique({
        where: {
          id: id,
        },
        select: selectOptions,
      })
      .catch((e: Error) => {
        console.log(e);
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new BadRequestException(e);
      });

    switch (role) {
      case 'ADMIN':
        return item as ItemAdminReturn;
      default:
        return item as ItemDetailedReturn;
    }
  }

  async create(item: ItemManipulationModel): Promise<ItemCommonReturn> {
    const newItemData: {
      name: string;
      description: string;
      RelatedPerson?: {
        connect: {
          id: number;
        };
      };
      ItemType?: {
        connect: {
          id: number;
        };
      };
    } = {
      name: item.name,
      description: item.description,
    };

    if (item.relatedPersonId != null) {
      newItemData.RelatedPerson = {
        connect: {
          id: item.relatedPersonId,
        },
      };
    }

    if (item.itemTypeId != null) {
      newItemData.ItemType = {
        connect: {
          id: item.itemTypeId,
        },
      };
    }

    const newItem: unknown = await this.prismaBase.item
      .create({
        data: newItemData,
        select: new ItemAdminSelect(),
      })
      .catch((e: Error) => {
        console.log(e);
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e);
      });

    return newItem as ItemCommonReturn;
  }

  async update(
    id: number,
    updatedItem: ItemManipulationModel
  ): Promise<ItemCommonReturn> {
    const updatedItemData: {
      name: string;
      description: string;
      RelatedPerson?: {
        connect: {
          id: number;
        };
      };
      ItemType?: {
        connect: {
          id: number;
        };
      };
    } = {
      name: updatedItem.name,
      description: updatedItem.description,
    };

    if (updatedItem.relatedPersonId != null) {
      updatedItemData.RelatedPerson = {
        connect: {
          id: updatedItem.relatedPersonId,
        },
      };
    }

    if (updatedItem.itemTypeId != null) {
      updatedItemData.ItemType = {
        connect: {
          id: updatedItem.itemTypeId,
        },
      };
    }
    const updated: unknown = await this.prismaBase.item
      .update({
        where: { id: id },
        data: updatedItemData,
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e);
      });

    return updated as ItemCommonReturn;
  }

  async delete(id: number): Promise<ItemCommonReturn> {
    const deleted: unknown = await this.prismaBase.item
      .delete({
        where: { id: id },
        select: new ItemCommonSelect(),
      })
      .catch((e: Error) => {
        console.log(e);
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e);
      });
    return deleted as ItemCommonReturn;
  }

  async findAllVideoPendingItems(): Promise<ItemCommonReturn> {
    const items: unknown = this.prismaBase.item.findMany({
      where: {
        Videos: {
          none: {
            validationStatus: 'VALIDATED',
          },
        },
      },
    });
    return items as ItemCommonReturn;
  }
}
