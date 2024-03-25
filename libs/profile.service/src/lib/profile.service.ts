import {
  Prisma,
  PrismaBaseService,
  Profile,
  User
} from '@noloback/prisma-client-base'
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
  ProfileAdminReturn,
  ProfileCommonSelect,
  ProfileListSelect,
  ProfileAdminSelect
} from './models/profile.api.models'
import { UserRequestModel } from '@noloback/requests'

@Injectable()
export class ProfileService {
  constructor (private prismaBase: PrismaBaseService) {}

  async getUserProfiles (
    user: UserRequestModel,
    role: 'USER' | 'ADMIN' | 'REFERENT'
  ): Promise<ProfileListReturn[]> {
    let selectOptions: Prisma.ProfileSelect

    switch (role) {
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
    switch (role) {
      case 'ADMIN':
        return profiles as ProfileAdminReturn[]
      default:
        return profiles as ProfileListReturn[]
    }
  }

  async getActiveProfile (user: UserRequestModel): Promise<ProfileCommonReturn> {
    const activeProfile = await this.prismaBase.profile.findMany({
      where: {
        userId: user.id,
        isActive: true
      },
      select: new ProfileCommonSelect()
    })
    if (activeProfile.length === 0 || activeProfile.length > 1) {
      throw new UnauthorizedException('No active profile found')
    }
    return activeProfile[0] as ProfileCommonReturn
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
    role: 'USER' | 'ADMIN' | 'REFERENT' | 'CREATOR' | 'MODERATOR'
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
    role: 'USER' | 'ADMIN' | 'REFERENT' | 'CREATOR' | 'MODERATOR'
  ): Promise<ProfileCommonReturn> {
    const toWho = await this.prismaBase.user.findUnique({
      where: { id: userId },
      include: {
        profiles: {
          select: {
            id: true,
            role: true
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
    const profileToDelete: { id: number; role: string } | undefined =
      toWho.profiles.find(profile => profile.role === role)
    if (!profileToDelete) {
      throw new ConflictException('Profile not found')
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
