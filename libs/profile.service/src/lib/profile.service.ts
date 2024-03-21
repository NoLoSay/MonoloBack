import { Prisma, PrismaBaseService, User } from '@noloback/prisma-client-base'
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'

@Injectable()
export class ProfileService {
  constructor (private prismaBase: PrismaBaseService) {}

  async getUserProfilesFromId (id: number) {
    return await this.prismaBase.profile.findMany({
      where: {
        userId: id
      },
      select: {
        id: true,
        role: true,
        isActive: true
      }
    })
  }

  async changeActiveProfile (userId: number, profileId: number) {
    const requestedProfile = await this.prismaBase.profile.findUnique({
      where: {
        id: profileId,
        userId: userId
      },
      select: {
        id: true,
        role: true
      }
    })
    if (!requestedProfile) {
      throw new UnauthorizedException('Profile not found')
    }
    await this.prismaBase.profile.updateMany({
      where: {
        userId: userId
      },
      data: {
        isActive: false
      }
    })
    await this.prismaBase.profile.update({
      where: {
        id: profileId
      },
      data: { isActive: true }
    })
    return requestedProfile
  }
}
