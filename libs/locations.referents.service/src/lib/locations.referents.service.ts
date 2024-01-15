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

  async findReferents (locationId: number): Promise<object[]> {
    return await this.prismaBase.locationHasReferent
      .findMany({
        where: {
          locationId: locationId
        },
        select: {
          id: true,
          isMain: true,
          User: {
            select: {
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
    relId: number,
    referent: LocationReferentModificationModel
  ): Promise<LocationHasReferent> {
    return await this.prismaBase.locationHasReferent
      .update({
        where: {
          id: relId,
          locationId: locationId
        },
        data: {
          isMain: referent.isMain
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async deleteReferent (
    locationId: number,
    relId: number
  ): Promise<LocationHasReferent> {
    return await this.prismaBase.locationHasReferent
      .delete({
        where: {
          id: relId,
          locationId: locationId
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }
}
