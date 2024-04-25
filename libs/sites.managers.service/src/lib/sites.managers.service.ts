import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import {
  RemoveManagerRequestBody,
  SiteManagerModificationRequestBody
} from '@noloback/api.request.bodies'
import { SiteManagerCommonReturn } from '@noloback/api.returns'
import { SiteManagerCommonSelect } from '@noloback/db.calls'
import { SiteManagerCommonDbReturn } from '@noloback/db.returns'
import {
  PrismaBaseService,
  Role,
  SiteHasManager
} from '@noloback/prisma-client-base'
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
      user.activeProfile.role === Role.ADMIN ||
      (user.activeProfile.role === Role.MANAGER &&
        (await this.isManagerOfSite(user.activeProfile.id, siteId)))
    )
  }

  async findManagers (siteId: number): Promise<SiteManagerCommonReturn[]> {
    return await this.prismaBase.siteHasManager
      .findMany({
        where: {
          siteId: siteId
        },
        select: new SiteManagerCommonSelect()
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
      .then((managers: unknown[]) => {
        return managers.map(
          manager =>
            new SiteManagerCommonReturn(manager as SiteManagerCommonDbReturn)
        )
      })
  }

  private async createManagerProfile (
    userId: number
  ): Promise<{ id: number; role: Role; deletedAt: Date | null }> {
    const profile = await this.prismaBase.profile.create({
      data: {
        role: Role.MANAGER,
        user: {
          connect: {
            id: userId
          }
        }
      },
      select: {
        id: true,
        role: true,
        deletedAt: true
      }
    })
    if (profile === null) {
      throw new InternalServerErrorException('Failed to create profile')
    }
    return profile
  }

  private async reactivateProfile (
    profileId: number
  ): Promise<{ id: number; role: Role; deletedAt: Date | null }> {
    return await this.prismaBase.profile.update({
      where: { id: profileId },
      data: { deletedAt: null },
      select: {
        id: true,
        role: true,
        deletedAt: true
      }
    })
  }

  async addManager (
    siteId: number,
    managerEmail: string
  ): Promise<SiteManagerCommonReturn> {
    const managerUser = await this.prismaBase.user.findUnique({
      where: { email: managerEmail },
      include: {
        profiles: {
          select: {
            id: true,
            role: true,
            deletedAt: true
          }
        }
      }
    })
    if (managerUser === null) {
      //TODO: here we should send an email to the user to invite him to create an account
      throw new NotFoundException('User not found')
    }
    await this.checkSiteValidity(siteId)
    let managerProfile = managerUser.profiles.find(
      profile => profile.role === Role.MANAGER
    )
    if (!managerProfile) {
      managerProfile = await this.createManagerProfile(managerUser.id)
    } else if (managerProfile.deletedAt !== null) {
      managerProfile = await this.reactivateProfile(managerProfile.id)
    } else if (await this.isManagerOfSite(managerProfile.id, siteId)) {
      throw new ConflictException(
        'Manager is already a manager of this site'
      )
    }
    const alreadyManager = await this.prismaBase.siteHasManager.findUnique({
      where: {
        profileId_siteId: {
          profileId: managerProfile.id,
          siteId: siteId
        }
      }
    })
    if (alreadyManager) {
      if (alreadyManager.deletedAt !== null) {
        return new SiteManagerCommonReturn(
          (await this.prismaBase.siteHasManager
            .update({
              where: {
                profileId_siteId: {
                  profileId: managerProfile.id,
                  siteId: siteId
                }
              },
              data: {
                deletedAt: null
              },
              select: new SiteManagerCommonSelect()
            })
            .catch((e: Error) => {
              // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
              throw new InternalServerErrorException(e)
            })) as unknown as SiteManagerCommonDbReturn
        )
      }
      throw new ConflictException('Manager is already a manager of this site')
    }
    return new SiteManagerCommonReturn(
      (await this.prismaBase.siteHasManager.create({
        data: {
          profileId: managerProfile.id,
          siteId: siteId
        },
        select: new SiteManagerCommonSelect()
      })) as unknown as SiteManagerCommonDbReturn
    )
  }

  private async checkSiteValidity (siteId: number) {
    const site = await this.prismaBase.site.findUnique({
      where: { id: siteId }
    })
    if (site === null) {
      throw new NotFoundException('Site not found')
    }
    return site
  }

  private async getManagerProfile (
    managerEmail: string
  ): Promise<{ id: number; role: Role; deletedAt: Date | null }> {
    const managerUser = await this.prismaBase.user.findUnique({
      where: { email: managerEmail },
      include: {
        profiles: {
          select: {
            id: true,
            role: true,
            deletedAt: true
          }
        }
      }
    })
    if (managerUser === null) {
      throw new NotFoundException('User not found')
    }
    const managerProfile = managerUser.profiles.find(
      profile => profile.role === Role.MANAGER
    )
    if (!managerProfile) {
      throw new NotFoundException('Manager not found')
    }
    return managerProfile
  }

  async updateManager (
    siteId: number,
    updatedRelation: SiteManagerModificationRequestBody
  ): Promise<SiteManagerCommonReturn> {
    await this.checkSiteValidity(siteId)
    const managerProfile = await this.getManagerProfile(updatedRelation.email)
    if (
      !managerProfile ||
      managerProfile.deletedAt !== null ||
      !(await this.isManagerOfSite(managerProfile.id, siteId))
    ) {
      throw new NotFoundException('Manager not found')
    }
    return new SiteManagerCommonReturn(
      (await this.prismaBase.siteHasManager
        .update({
          where: {
            profileId_siteId: {
              profileId: managerProfile.id,
              siteId: siteId
            }
          },
          data: {
            isMain: updatedRelation.isMain
          },
          select: new SiteManagerCommonSelect()
        })
        .catch((e: Error) => {
          // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
          throw new InternalServerErrorException(e)
        })) as unknown as SiteManagerCommonDbReturn
    )
  }

  async deleteManager (
    siteId: number,
    removedManager: RemoveManagerRequestBody
  ): Promise<SiteManagerCommonReturn> {
    await this.checkSiteValidity(siteId)
    const managerProfile = await this.getManagerProfile(removedManager.email)
    if (
      !managerProfile ||
      managerProfile.deletedAt !== null ||
      !(await this.isManagerOfSite(managerProfile.id, siteId))
    ) {
      throw new NotFoundException('Manager not found')
    }
    return new SiteManagerCommonReturn(
      (await this.prismaBase.siteHasManager
        .update({
          where: {
            profileId_siteId: {
              profileId: managerProfile.id,
              siteId: siteId
            }
          },
          data: {
            deletedAt: new Date()
          },
          select: new SiteManagerCommonSelect()
        })
        .catch((e: Error) => {
          // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
          throw new InternalServerErrorException(e)
        })) as unknown as SiteManagerCommonDbReturn
    )
  }

  async isManagerOfSite (
    managerProfileId: number,
    siteId: number
  ): Promise<boolean> {
    const relation: SiteHasManager | null = await this.prismaBase.siteHasManager
      .findUnique({
        where: {
          profileId_siteId: {
            siteId: siteId,
            profileId: managerProfileId
          },
          deletedAt: null
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
            profileId: managerProfileId
          },
          isMain: true,
          deletedAt: null
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })
    return relation !== null
  }
}
