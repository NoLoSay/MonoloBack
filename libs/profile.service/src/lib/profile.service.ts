import { Prisma, PrismaBaseService } from '@noloback/prisma-client-base'
import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
import {
  ProfileCommonReturn,
  ProfileListReturn,
  ProfileAdminReturn
} from '@noloback/api.returns'
import {
  ProfileCommonSelect,
  ProfileListSelect,
  ProfileAdminSelect
} from '@noloback/db.calls'
import { UserRequestModel } from '@noloback/requests.constructor'

@Injectable()
export class ProfileService {
  constructor (
    private readonly prismaBase: PrismaBaseService
  ) {}

  async getUserProfiles (user: UserRequestModel): Promise<ProfileListReturn[]> {
    let selectOptions: Prisma.ProfileSelect

    switch (user.activeProfile.role) {
      case 'ADMIN':
        selectOptions = new ProfileAdminSelect()
        break
      default:
        selectOptions = new ProfileListSelect()
    }
    const profiles = await this.prismaBase.profile.findMany({
      where: { userId: user.id, deletedAt: null },
      select: selectOptions
    })
    switch (user.activeProfile.role) {
      case 'ADMIN':
        return profiles as ProfileAdminReturn[]
      default:
        return profiles as ProfileListReturn[]
    }
  }

  async getActiveProfile (user: UserRequestModel): Promise<ProfileCommonReturn> {
    const activeProfiles = await this.prismaBase.profile.findMany({
      where: {
        userId: user.id,
        isActive: true
      },
      select: new ProfileCommonSelect()
    })
    if (activeProfiles.length === 0 || activeProfiles.length > 1) {
      throw new UnauthorizedException('No active profile found')
    }
    return activeProfiles[0] as ProfileCommonReturn
  }

  async changeActiveProfile (
    user: UserRequestModel,
    profileId: number
  ): Promise<ProfileCommonReturn> {
    const requestedProfile = await this.prismaBase.profile.findUnique({
      where: {
        id: profileId,
        userId: user.id,
        deletedAt: null
      },
      select: new ProfileCommonSelect()
    })
    if (!requestedProfile) {
      throw new UnauthorizedException('Profile not found')
    }
    await this.prismaBase.profile.updateMany({
      where: { userId: user.id },
      data: { isActive: false }
    })

    await this.prismaBase.profile.update({
      where: { id: profileId },
      data: { isActive: true }
    })
    return requestedProfile as ProfileCommonReturn
  }

  async createProfile (
    userId: number,
    role: 'USER' | 'ADMIN' | 'MANAGER' | 'CREATOR' | 'MODERATOR'
  ): Promise<ProfileCommonReturn> {
    const toWho = await this.prismaBase.user.findUnique({
      where: { id: userId },
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
        where: { id: profileExist.id },
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
            id: userId
          }
        }
      },
      select: new ProfileCommonSelect()
    })
    return newProfile as ProfileCommonReturn
  }

  async deleteUsersProfileByRole (
    userId: number,
    role: 'USER' | 'ADMIN' | 'MANAGER' | 'CREATOR' | 'MODERATOR'
  ): Promise<ProfileCommonReturn> {
    const toWho = await this.prismaBase.user.findUnique({
      where: { id: userId },
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
      | { id: number; role: string; deletedAt: Date | null }
      | undefined = toWho.profiles.find(profile => profile.role === role)
    if (!profileToDelete || profileToDelete.deletedAt) {
      throw new ConflictException('Profile not found or already deleted')
    }
    const deletedProfile = await this.prismaBase.profile.update({
      where: { id: profileToDelete.id },
      data: { isActive: false, deletedAt: new Date() },
      select: new ProfileCommonSelect()
    })
    await this.prismaBase.profile.updateMany({
      where: { userId: userId },
      data: { isActive: false }
    })
    await this.prismaBase.profile.updateMany({
      where: { userId: userId, role: 'USER' },
      data: { isActive: true }
    })

    return deletedProfile as ProfileCommonReturn
  }
}
