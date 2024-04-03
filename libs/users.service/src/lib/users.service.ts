import {
  Prisma,
  PrismaBaseService,
  Role,
  User
} from '@noloback/prisma-client-base'
import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { hash } from 'bcrypt'
import { LoggerService } from '@noloback/logger-lib'
import { LogCriticity } from '@prisma/client/logs'
import {
  UserAdminReturn,
  UserCommonReturn,
  UserMeReturn
} from '@noloback/api.returns'
import {
  UserAdminSelect,
  UserCommonSelect,
  UserMeSelect
} from '@noloback/db.calls'
import {
  UserCreateModel,
  UserUpdateModel
} from './models/user.manipulation.models'
import { UserRequestModel } from '@noloback/requests.constructor'

@Injectable()
export class UsersService {
  constructor (
    private prismaBase: PrismaBaseService,
    private loggingService: LoggerService
  ) {}

  async count () {
    return await this.prismaBase.user.count({
      where: { deletedAt: null }
    })
  }

  async create (createUserDto: UserCreateModel) {
    const userUsername: User | null = await this.prismaBase.user.findUnique({
      where: { username: createUserDto.username }
    })
    if (userUsername != null) {
      throw new ConflictException('Username already taken')
    }

    const userEmail: User | null = await this.prismaBase.user.findUnique({
      where: { email: createUserDto.email }
    })
    if (userEmail != null) {
      throw new ConflictException('Email address already taken')
    }

    const newUser: User = await this.prismaBase.user
      .create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: await hash(createUserDto.password, 12),
          telNumber: createUserDto.telNumber,
          profiles: {
            create: {
              role: 'USER',
              isActive: true
            }
          }
        }
      })
      .catch((e: Error) => {
        this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    await this.prismaBase.userLoginLog.create({
      data: {
        userId: newUser.id
      }
    })

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }
  }

  async findAll (
    role: 'USER' | 'ADMIN' | 'MANAGER',
    firstElem: number,
    lastElem: number
  ): Promise<UserCommonReturn[] | UserAdminReturn[]> {
    let selectOptions: Prisma.UserSelect

    switch (role) {
      case 'ADMIN':
        selectOptions = new UserAdminSelect()
        break
      default:
        selectOptions = new UserCommonSelect()
    }

    const users = await this.prismaBase.user.findMany({
      skip: firstElem,
      take: lastElem - firstElem,
      where: role === Role.ADMIN ? undefined : { deletedAt: null },
      select: selectOptions
    })

    switch (role) {
      case 'ADMIN':
        return users as UserAdminReturn[]
      default:
        return users as UserCommonReturn[]
    }
  }

  async findMe (user: UserRequestModel) {
    const userMe = await this.prismaBase.user.findUnique({
      where: { id: user.id },
      select: new UserMeSelect()
    })

    return userMe as UserMeReturn
  }

  async findOne (id: number, role: 'USER' | 'ADMIN' | 'MANAGER') {
    let selectOptions: Prisma.UserSelect

    switch (role) {
      case 'ADMIN':
        selectOptions = new UserAdminSelect()
        break
      default:
        selectOptions = new UserCommonSelect()
    }
    const where: {
      id: number
      deletedAt?: Date | null
    } = { id: id }

    if (role !== 'ADMIN') {
      where.deletedAt = null
    }

    const user = await this.prismaBase.user.findUnique({
      where: where,
      select: selectOptions
    })

    switch (role) {
      case 'ADMIN':
        return user as unknown as UserAdminReturn
      default:
        return user as unknown as UserCommonReturn
    }
  }

  private formatUser (user: any, withPassword = true): UserRequestModel | null {
    const formatedUser = user
      ? {
          id: user.id,
          username: user.username,
          password: user.password,
          email: user.email,
          picture: user.picture,
          telNumber: user.telNumber,
          createdAt: user.createdAt,
          activeProfile: user.profiles[0]
        }
      : null
    if (formatedUser && !withPassword) {
      delete formatedUser.password
    }
    return formatedUser as UserRequestModel
  }

  async findOneByUsername (username: string): Promise<UserRequestModel | null> {
    return await this.formatUser(
      await this.prismaBase.user.findUnique({
        where: { username: username, deletedAt: null },
        include: {
          profiles: {
            select: {
              id: true,
              role: true
            },
            where: {
              isActive: true
            }
          }
        }
      }),
      false
    )
  }

  async findOneByEmail (username: string): Promise<UserRequestModel | null> {
    return await this.formatUser(
      await this.prismaBase.user.findUnique({
        where: { email: username, deletedAt: null  },
        include: {
          profiles: {
            select: {
              id: true,
              role: true
            },
            where: {
              isActive: true
            }
          }
        }
      }),
      false
    )
  }

  private async reactivateUserProfile (
    user: User
  ): Promise<UserRequestModel | null> {
    const reactivatedProfiles = await this.prismaBase.profile.updateMany({
      where: {
        userId: user.id,
        role: Role.USER,
        deletedAt: null
      },
      data: {
        isActive: true
      }
    })
    if (reactivatedProfiles.count === 0) {
      throw new InternalServerErrorException(
        'User has no activable profile. Please contact us.'
      )
    }
    return this.connectUserByEmailOrUsername(user.email)
  }

  async connectUserByEmailOrUsername (
    search: string
  ): Promise<UserRequestModel | null> {
    const user = await this.prismaBase.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email: search }, { username: search }]
      },
      include: {
        profiles: {
          select: {
            id: true,
            role: true,
            isActive: true
          }
        }
      }
    })
    if (!user || user.deletedAt) return null
    const activeProfile = user.profiles.find(
      profile => profile.isActive === true
    )
    if (!activeProfile) {
      return this.reactivateUserProfile(user)
    }
    if (!activeProfile)
      throw new InternalServerErrorException(
        'User has no activable profile. Please contact us.'
      )
    user.profiles = [activeProfile]
    return this.formatUser(user)
  }

  async update (id: number, updateUser: UserUpdateModel): Promise<UserMeReturn> {
    const data: {
      username?: string
      email?: string
      password?: string
      picture?: string
      telNumber?: string
    } = {
      username: updateUser.username,
      email: updateUser.email,
      picture: updateUser.picture,
      password: updateUser.password
        ? await hash(updateUser.password, 12)
        : undefined,
      telNumber: updateUser.telNumber
    }

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    )

    return (await this.prismaBase.user.update({
      where: { id: id },
      data: filteredData,
      select: new UserMeSelect()
    })) as unknown as UserMeReturn
  }

  async remove (id: number) {
    return await this.prismaBase.user.update({
      where: { id: id },
      data: { deletedAt: new Date() },
      select: new UserMeSelect()
    }) as unknown as UserMeReturn
  }
}
