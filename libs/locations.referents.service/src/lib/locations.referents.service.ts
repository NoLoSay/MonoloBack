import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
  PrismaBaseService,
  LocationHasReferent
} from '@noloback/prisma-client-base'
import {
  LocationReferentAdditionModel,
  LocationReferentModificationModel
} from './models/locationReferentManipulation.model'
// import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class LocationsReferentsService {
  constructor (
    private prismaBase: PrismaBaseService // private loggingService: LoggerService
  ) {}

  async isAllowedToModify (
    user: { id: number; activeProfile: { role: string } },
    locationId: number
  ): Promise<boolean> {
    return (
      user.activeProfile.role === 'ADMIN' ||
      (user.activeProfile.role === 'REFERENT' &&
        (await this.isReferentOfLocation(user.id, locationId)))
    )
  }

  async findReferents (locationId: number): Promise<object[]> {
    return await this.prismaBase.locationHasReferent
      .findMany({
        where: {
          locationId: locationId
        },
        select: {
          isMain: true,
          User: {
            select: {
              id: true,
              username: true,
              email: true,
              picture: true
            }
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async addReferent (
    locationId: number,
    referent: LocationReferentAdditionModel
  ): Promise<LocationHasReferent> {
    return await this.prismaBase.locationHasReferent
      .create({
        data: {
          isMain: referent.isMain,
          locationId: locationId,
          userId: referent.referentId
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async updateReferent (
    locationId: number,
    userId: number,
    updatedRelation: LocationReferentModificationModel
  ): Promise<LocationHasReferent> {
    return await this.prismaBase.locationHasReferent
      .update({
        where: {
          userId_locationId: {
            userId: userId,
            locationId: locationId
          }
        },
        data: {
          isMain: updatedRelation.isMain
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async deleteReferent (
    locationId: number,
    userId: number
  ): Promise<LocationHasReferent> {
    return await this.prismaBase.locationHasReferent
      .delete({
        where: {
          userId_locationId: {
            locationId: locationId,
            userId: userId
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async isReferentOfLocation (referentId: number, locationId: number) {
    const relation: LocationHasReferent | null =
      await this.prismaBase.locationHasReferent
        .findUnique({
          where: {
            userId_locationId: {
              locationId: locationId,
              userId: referentId
            }
          }
        })
        .catch((e: Error) => {
          // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
          throw new InternalServerErrorException(e)
        })
    return relation !== null
  }

  async isMainReferentOfLocation (referentId: number, locationId: number) {
    const relation: LocationHasReferent | null =
      await this.prismaBase.locationHasReferent
        .findUnique({
          where: {
            userId_locationId: {
              locationId: locationId,
              userId: referentId,
              isMain: true
            }
          }
        })
        .catch((e: Error) => {
          // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
          throw new InternalServerErrorException(e)
        })
    return relation !== null
  }
}
