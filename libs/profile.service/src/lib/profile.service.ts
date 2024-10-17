import { Prisma, PrismaBaseService, Role } from '@noloback/prisma-client-base'
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import {
  ProfileCommonReturn,
  ProfileListReturn,
  ProfileAdminReturn,
  ProfileUserAdminReturn
} from '@noloback/api.returns'
import {
  ProfileCommonSelect,
  ProfileListSelect,
  ProfileAdminSelect,
  ProfileUserAdminSelect
} from '@noloback/db.calls'
import { UserRequestModel } from '@noloback/requests.constructor'

@Injectable()
export class ProfileService {
  constructor (private readonly prismaBase: PrismaBaseService) {}

  async getUserProfiles (user: UserRequestModel, role?: string | undefined): Promise<ProfileListReturn[] | ProfileUserAdminReturn[]> {
    let selectOptions: Prisma.ProfileSelect

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new ProfileUserAdminSelect()
        break
      default:
        selectOptions = new ProfileListSelect()
    }
    const profiles = await this.prismaBase.profile.findMany({
      where: {
        userId: user.activeProfile.role !== Role.ADMIN ? +user.id : undefined,
        role: role ? role as Role : undefined,
        deletedAt: null
      },
      select: selectOptions
    })
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return profiles as ProfileUserAdminReturn[]
      default:
        return profiles as ProfileListReturn[]
    }
  }

  async getMyProfiles (user: UserRequestModel): Promise<ProfileListReturn[]> {
    return await this.prismaBase.profile.findMany({
      where: {
        userId: +user.id,
        deletedAt: null
      },
      select: new ProfileListSelect()
    }) as ProfileListReturn[]
  }

  async getActiveProfile (user: UserRequestModel): Promise<ProfileCommonReturn> {
    const activeProfiles = await this.prismaBase.profile.findMany({
      where: {
        userId: +user.id,
        isActive: true
      },
      select: new ProfileCommonSelect()
    })
    if (activeProfiles.length === 0 || activeProfiles.length > 1) {
      throw new UnauthorizedException('No active profile found')
    }
    return activeProfiles[0] as ProfileCommonReturn
  }

  private async unactiveAllProfiles (userId: number) {
    return this.prismaBase.profile.updateMany({
      where: { userId: +userId },
      data: { isActive: false }
    })
  }

  private async unactiveAllProfilesExceptOne (
    userId: number,
    profileId: number
  ) {
    return this.prismaBase.profile.updateMany({
      where: { userId: +userId, NOT: { id: +profileId } },
      data: { isActive: false }
    })
  }

  private async activateProfile (profileId: number) {
    return this.prismaBase.profile.update({
      where: { id: +profileId },
      data: { isActive: true },
      select: new ProfileCommonSelect()
    })
  }

  private async activateProfileByRole (userId: number, role: Role) {
    return this.prismaBase.profile.update({
      where: { userId_role: { userId: +userId, role: role } },
      data: { isActive: true },
      select: new ProfileCommonSelect()
    })
  }

  async canUserUseThisProfileRole (
    userId: number,
    role: Role
  ): Promise<boolean> {
    const profile = await this.prismaBase.profile.findFirst({
      where: { userId: +userId, role: role }
    })
    return !!(profile && !profile.deletedAt)
  }

  async canUserUseThisProfileId (
    userId: number,
    profileId: number
  ): Promise<boolean> {
    const profile = await this.prismaBase.profile.findFirst({
      where: { userId: +userId, id: +profileId }
    })
    return !!(profile && !profile.deletedAt)
  }

  async changeActiveProfile (
    user: UserRequestModel,
    profileId: number
  ): Promise<ProfileCommonReturn> {
    if (!this.canUserUseThisProfileId(user.activeProfile.id, profileId))
      throw new UnauthorizedException('Profile not found')
    await this.unactiveAllProfiles(user.id)
    return (await this.activateProfile(profileId)) as ProfileCommonReturn
  }

  async changeActiveProfileWithRole (
    user: UserRequestModel,
    role: Role
  ): Promise<ProfileCommonReturn> {
    if (!this.canUserUseThisProfileRole(user.id, role))
      throw new NotFoundException('Profile not found')
    await this.unactiveAllProfiles(user.id)
    return (await this.activateProfileByRole(
      user.id,
      role
    )) as ProfileCommonReturn
  }

  async createProfile (
    userId: number,
    role: Role
  ): Promise<ProfileCommonReturn> {
    const toWho = await this.prismaBase.user.findUnique({
      where: { id: +userId },
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
    if (!toWho) {
      throw new UnauthorizedException('User not found')
    }
    if (toWho.deletedAt) {
      throw new ForbiddenException('User is deleted')
    }
    const profileExist = toWho.profiles.find(profile => profile.role === role)
    if (profileExist) {
      if (!profileExist.deletedAt)
        throw new ConflictException('Profile already exist')
      const reactivatedProfile = await this.prismaBase.profile.update({
        where: { id: +profileExist.id },
        data: { deletedAt: null },
        select: new ProfileCommonSelect()
      })
      return reactivatedProfile as ProfileCommonReturn
    }
    const newProfile = await this.prismaBase.profile.create({
      data: {
        role: role,
        user: {
          connect: {
            id: +userId
          }
        }
      },
      select: new ProfileCommonSelect()
    })
    return newProfile as ProfileCommonReturn
  }

  async deleteUsersProfileByRole (
    userId: number,
    role: Role
  ): Promise<ProfileCommonReturn> {
    const toWho = await this.prismaBase.user.findUnique({
      where: { id: +userId },
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
    if (!toWho) {
      throw new UnauthorizedException('User not found')
    }
    if (toWho.deletedAt) {
      throw new ForbiddenException('User is deleted')
    }
    const profileToDelete:
      | { id: number; role: Role; deletedAt: Date | null }
      | undefined = toWho.profiles.find(profile => profile.role === role)
    if (!profileToDelete || profileToDelete.deletedAt) {
      throw new ConflictException('Profile not found or already deleted')
    }
    const deletedProfile = await this.prismaBase.profile.update({
      where: { id: +profileToDelete.id },
      data: { isActive: false, deletedAt: new Date() },
      select: new ProfileCommonSelect()
    })
    await this.unactiveAllProfiles(userId)
    await this.activateProfileByRole(userId, Role.USER)

    return deletedProfile as ProfileCommonReturn
  }

  async deleteProfileById(
    userId: number,
    profileId: number
  ): Promise<ProfileCommonReturn> {
    const toWho = await this.prismaBase.user.findUnique({
      where: { id: +userId },
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
    if (!toWho) {
      throw new UnauthorizedException('User not found')
    }
    if (toWho.deletedAt) {
      throw new ForbiddenException('User is deleted')
    }
    const profileToDelete:
      | { id: number; role: Role; deletedAt: Date | null }
      | undefined = toWho.profiles.find(profile => profile.id === profileId)
    if (!profileToDelete || profileToDelete.deletedAt)
      throw new NotFoundException('Profile not found or already deleted')
    if (profileToDelete.role === Role.USER)
      throw new ForbiddenException('Cannot delete user profile')
    const deletedProfile = await this.prismaBase.profile.update({
      where: { id: +profileToDelete.id },
      data: { isActive: false, deletedAt: new Date() },
      select: new ProfileCommonSelect()
    })
    await this.unactiveAllProfiles(userId)
    await this.activateProfileByRole(userId, Role.USER)

    return deletedProfile as ProfileCommonReturn
  }
}
