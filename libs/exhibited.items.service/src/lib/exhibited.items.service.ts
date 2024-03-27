import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
  PrismaBaseService,
  ExhibitedItem
} from '@noloback/prisma-client-base'
import { ExhibitedItemAdditionModel } from './models/exhibitedItemManipulation.model'
// import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ExhibitedItemsService {
  constructor (
    private prismaBase: PrismaBaseService // private loggingService: LoggerService
  ) {}

  async findExibitedItems (exhibitionId: number): Promise<object[]> {
    return await this.prismaBase.exhibitedItem
      .findMany({
        where: {
          exhibitionId: exhibitionId
        },
        select: {
          id: true,
          exhibition: {
            select: {
              name: true,
              site: {
                select: {
                  name: true
                }
              }
            }
          },
          item: {
            select: {
              id: true,
              name: true,
              description: true,
              relatedPerson: {
                select: {
                  name: true,
                  bio: true
                }
              },
              itemType: {
                select: {
                  name: true,
                  description: true,
                  itemCategory: {
                    select: {
                      name: true,
                      description: true
                    }
                  }
                }
              }
            }
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async addExhibitedItem (
    exhibitionId: number,
    exhibitedItem: ExhibitedItemAdditionModel
  ): Promise<ExhibitedItem> {
    return await this.prismaBase.exhibitedItem
      .create({
        data: {
          exhibition: {
            connect: {
              id: exhibitionId
            }
          },
          item: {
            connect: {
              id: exhibitedItem.itemId
            }
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async deleteExhibitedItem (
    exhibitionId: number,
    itemId: number
  ): Promise<ExhibitedItem> {
    return await this.prismaBase.exhibitedItem
      .delete({
        where: {
          itemId_exhibitionId: {
          itemId: itemId,
          exhibitionId: exhibitionId
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }
}
