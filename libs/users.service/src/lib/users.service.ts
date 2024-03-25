import { Prisma, PrismaBaseService, User } from '@noloback/prisma-client-base'
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
import { hash } from 'bcrypt'
import { LoggerService } from '@noloback/logger-lib'
import { LogCriticity } from '@prisma/client/logs'
import {
  UserAdminReturn,
  UserAdminSelect,
  UserCommonReturn,
  UserCommonSelect
} from './models/user.api.models'
import {
  UserAdminUpdateModel,
  UserCreateModel
} from './models/user.manipulation.models'
import { UserRequestModel } from '@noloback/requests'

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
    role: 'USER' | 'ADMIN' | 'REFERENT',
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
      where: { deletedAt: null },
      select: selectOptions
    })

    switch (role) {
      case 'ADMIN':
        return users as UserAdminReturn[]
      default:
        return users as UserCommonReturn[]
    }
  }

  async findOne (id: number, role: 'USER' | 'ADMIN' | 'REFERENT') {
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
        where: { username: username },
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
        where: { email: username },
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

  async connectUserByEmailOrUsername (
    search: string
  ): Promise<UserRequestModel | null> {
    const user = await this.prismaBase.user.findFirst({
      where: {
        OR: [{ email: search }, { username: search }]
      },
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
    })

    return user && user?.profiles.length && !user?.deletedAt
      ? this.formatUser(user)
      : null
  }

  async update (
    id: number,
    updateUser: UserAdminUpdateModel,
    role: 'USER' | 'ADMIN' | 'REFERENT'
  ) {
    if (updateUser.role && role !== 'ADMIN') {
      throw new UnauthorizedException()
    }

    const data: {
      username?: string
      email?: string
      password?: string
      picture?: string
      role?: string
      telNumber?: string
    } = {
      username: updateUser.username,
      email: updateUser.email,
      picture: updateUser.picture,
      role: updateUser.role,
      password: updateUser.password
        ? await hash(updateUser.password, 12)
        : undefined,
      telNumber: updateUser.telNumber
    }

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    )

    return this.prismaBase.user.update({
      where: { id: id },
      data: filteredData
    })
  }

  async remove (id: number) {
    return await this.prismaBase.user.update({
      where: { id: id },
      data: { deletedAt: new Date() }
    })
  }
}
