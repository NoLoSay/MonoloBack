import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogCriticity, PrismaBaseService } from '@noloback/prisma-client-base';
import { ExhibitedItemAdditionModel } from '@noloback/api.request.bodies';
import { ExhibitionCommonSelect, ItemCommonSelect } from '@noloback/db.calls';
import {
  ExhibitionCommonReturn,
  ItemCommonReturn,
} from '@noloback/api.returns';
import { LoggerService } from '@noloback/logger-lib';

@Injectable()
export class ExhibitedItemsService {
  constructor(
    private prismaBase: PrismaBaseService,
    private loggingService: LoggerService,
  ) {}

  async canItemBeUsedInExhibition(
    itemId: number,
    exhibitionId: number,
  ): Promise<boolean> {
    const exhibitionSite = await this.prismaBase.exhibition.findUnique({
      where: { id: +exhibitionId },
      select: {
        siteId: true,
      },
    });
    if (!exhibitionSite) throw new NotFoundException('Exhibition not found.');

    const itemSite = await this.prismaBase.item.findUnique({
      where: { id: +itemId },
      select: {
        siteId: true,
      },
    });
    if (!itemSite) throw new NotFoundException('Item not found.');
    return exhibitionSite.siteId === itemSite.siteId;
  }

  async findExibitedItems(exhibitionId: number): Promise<ItemCommonReturn[]> {
    const exhibitedItems = await this.prismaBase.exhibitedItem
      .findMany({
        where: {
          exhibitionId: +exhibitionId,
          item: {
            deletedAt: null,
          },
        },
        select: {
          item: {
            select: new ItemCommonSelect(),
          },
        },
      })
      .catch((e: Error) => {
        this.loggingService.log(
          LogCriticity.Critical,
          this.constructor.name,
          e,
        );
        throw new InternalServerErrorException(e);
      });
    return exhibitedItems.map((exhibitedItem) => {
      return exhibitedItem.item as unknown as ItemCommonReturn;
    });
  }

  async addExhibitedItem(
    exhibitionId: number,
    exhibitedItem: ExhibitedItemAdditionModel,
  ): Promise<{ item: ItemCommonReturn; exhibition: ExhibitionCommonReturn }> {
    if (
      (await this.prismaBase.exhibitedItem.count({
        where: { itemId: +exhibitedItem.itemId, exhibitionId: +exhibitionId },
      })) > 0
    )
      throw new ConflictException('Item already exhibited in this exhibition.');
    const createdExhibitedItem = await this.prismaBase.exhibitedItem
      .create({
        data: {
          exhibition: {
            connect: {
              id: +exhibitionId,
            },
          },
          item: {
            connect: {
              id: +exhibitedItem.itemId,
            },
          },
        },
        select: {
          item: {
            select: new ItemCommonSelect(),
          },
          exhibition: {
            select: new ExhibitionCommonSelect(),
          },
        },
      })
      .catch((e: Error) => {
        this.loggingService.log(
          LogCriticity.Critical,
          this.constructor.name,
          e,
        );
        throw new InternalServerErrorException(e);
      });

    return {
      item: createdExhibitedItem.item as unknown as ItemCommonReturn,
      exhibition:
        createdExhibitedItem.exhibition as unknown as ExhibitionCommonReturn,
    };
  }

  async deleteExhibitedItem(
    exhibitionId: number,
    itemId: number,
  ): Promise<{ itemId: number; exhibitionId: number }> {
    if (
      !(await this.prismaBase.exhibitedItem.count({
        where: { itemId: +itemId, exhibitionId: +exhibitionId },
      }))
    )
      throw new NotFoundException('Item not exhibited in this exhibition.');
    return await this.prismaBase.exhibitedItem
      .delete({
        where: {
          itemId_exhibitionId: {
            itemId: +itemId,
            exhibitionId: +exhibitionId,
          },
        },
        select: {
          itemId: true,
          exhibitionId: true,
        },
      })
      .catch((e: Error) => {
        this.loggingService.log(
          LogCriticity.Critical,
          this.constructor.name,
          e,
        );
        throw new InternalServerErrorException(e);
      });
  }
}
