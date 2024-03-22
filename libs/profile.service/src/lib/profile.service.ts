import {
  Prisma,
  PrismaBaseService,
  Profile,
  User
} from '@noloback/prisma-client-base'
import {
  ConflictException,
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

@Injectable()
export class ProfileService {
  constructor (private prismaBase: PrismaBaseService) {}

  async getUserProfilesFromId (
    id: number,
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
      where: { userId: id },
      select: selectOptions
    })
    switch (role) {
      case 'ADMIN':
        return profiles as ProfileAdminReturn[]
      default:
        return profiles as ProfileListReturn[]
    }
  }

  async getActiveProfile (userId: number): Promise<ProfileCommonReturn> {
    const activeProfile = await this.prismaBase.profile.findMany({
      where: {
        userId: userId,
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
    userId: number,
    profileId: number
  ): Promise<ProfileCommonReturn> {
    const requestedProfile = await this.prismaBase.profile.findUnique({
      where: {
        id: profileId,
        userId: userId
      },
      select: new ProfileCommonSelect()
    })
    if (!requestedProfile) {
      throw new UnauthorizedException('Profile not found')
    }
    await this.prismaBase.profile.updateMany({
      where: { userId: userId },
      data: { isActive: false }
    })

    await this.prismaBase.profile.update({
      where: { id: profileId },
      data: { isActive: true }
    })
    return requestedProfile as ProfileCommonReturn
  }
}
