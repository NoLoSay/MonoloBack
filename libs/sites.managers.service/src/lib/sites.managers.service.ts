import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaBaseService, SiteHasManager } from '@noloback/prisma-client-base'
import {
  SiteManagerAdditionModel,
  SiteManagerModificationModel
} from './models/siteManagerManipulation.model'
import { UserRequestModel } from '@noloback/requests.constructor'
// import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class SitesManagersService {
  constructor (
    private prismaBase: PrismaBaseService // private loggingService: LoggerService
  ) {}

  async isAllowedToModify (
    user: UserRequestModel,
    siteId: number
  ): Promise<boolean> {
    return (
      user.activeProfile.role === 'ADMIN' ||
      (user.activeProfile.role === 'MANAGER' &&
        (await this.isManagerOfSite(user.id, siteId)))
    )
  }

  async findManagers (siteId: number): Promise<object[]> {
    return await this.prismaBase.siteHasManager
      .findMany({
        where: {
          siteId: siteId
        },
        select: {
          isMain: true
          // User: {
          //   select: {
          //     id: true,
          //     username: true,
          //     email: true,
          //     picture: true
          //   }
          // }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async addManager (
    siteId: number,
    manager: SiteManagerAdditionModel
  ): Promise<SiteHasManager> {
    return await this.prismaBase.siteHasManager
      .create({
        data: {
          isMain: manager.isMain,
          siteId: siteId,
          profileId: manager.managerId
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async updateManager (
    siteId: number,
    userId: number,
    updatedRelation: SiteManagerModificationModel
  ): Promise<SiteHasManager> {
    return await this.prismaBase.siteHasManager
      .update({
        where: {
          profileId_siteId: {
            profileId: userId,
            siteId: siteId
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

  async deleteManager (siteId: number, userId: number): Promise<SiteHasManager> {
    return await this.prismaBase.siteHasManager
      .delete({
        where: {
          profileId_siteId: {
            siteId: siteId,
            profileId: userId
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
  }

  async isManagerOfSite (managerProfileId: number, siteId: number) {
    const relation: SiteHasManager | null = await this.prismaBase.siteHasManager
      .findUnique({
        where: {
          profileId_siteId: {
            siteId: siteId,
            profileId: managerProfileId
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
    return relation !== null
  }

  async isMainManagerOfSite (managerProfileId: number, siteId: number) {
    const relation: SiteHasManager | null = await this.prismaBase.siteHasManager
      .findUnique({
        where: {
          profileId_siteId: {
            siteId: siteId,
            profileId: managerProfileId,
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
