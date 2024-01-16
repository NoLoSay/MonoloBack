import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
  PrismaBaseService,
  ExhibitedObject
} from '@noloback/prisma-client-base'
import { ExhibitedObjectAdditionModel } from './models/exhibitedObjectManipulation.model'
// import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ExhibitedObjectsService {
  constructor (
    private prismaBase: PrismaBaseService // private loggingService: LoggerService
  ) {}

  async findExibitedObjects (exhibitionId: number): Promise<object[]> {
    return await this.prismaBase.exhibitedObject
      .findMany({
        where: {
          exhibitionId: exhibitionId
        },
        select: {
          id: true,
          Exhibition: {
            select: {
              name: true,
              Location: {
                select: {
                  name: true
                }
              }
            }
          },
          Object: {
            select: {
              id: true,
              name: true,
              description: true,
              RelatedPerson: {
                select: {
                  name: true,
                  bio: true
                }
              },
              ObjectType: {
                select: {
                  name: true,
                  description: true,
                  ObjectCategory: {
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

  async addExhibitedObject (
    exhibitionId: number,
    exhibitedObject: ExhibitedObjectAdditionModel
  ): Promise<ExhibitedObject> {
    return await this.prismaBase.exhibitedObject
      .create({
        data: {
          Exhibition: {
            connect: {
              id: exhibitionId
            }
          },
          Object: {
            connect: {
              id: exhibitedObject.objectId
            }
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async deleteExhibitedObject (
    exhibitionId: number,
    objectId: number
  ): Promise<ExhibitedObject> {
    return await this.prismaBase.exhibitedObject
      .delete({
        where: {
          objectId_exhibitionId: {
          objectId: objectId,
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
