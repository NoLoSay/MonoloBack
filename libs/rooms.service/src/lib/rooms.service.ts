import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import {
  Prisma,
  PrismaBaseService,
  Role,
  Room
} from '@noloback/prisma-client-base'
import { UserRequestModel } from '@noloback/requests.constructor'
import {
  RoomAdminReturn,
  RoomAdminWithExhibitionsReturn,
  RoomCommonReturn,
  RoomManagerReturn,
  RoomManagerWithExhibitionsReturn,
  RoomWithExhibitionsReturn
} from '@noloback/api.returns'
import {
  RoomAdminSelect,
  RoomAdminWithExhibitionsSelect,
  RoomCommonSelect,
  RoomManagerSelect,
  RoomManagerWithExhibitionsSelect,
  RoomWithExhibitionsSelect
} from '@noloback/db.calls'
import { RoomManipulationModel } from '@noloback/api.request.bodies'

@Injectable()
export class RoomsService {
  constructor (
    private readonly prisma: PrismaBaseService //, private loggingService: LoggerService
  ) {}

  async getRoomsFromSite (
    siteId: number,
    user: UserRequestModel
  ): Promise<RoomCommonReturn[] | RoomManagerReturn[] | RoomAdminReturn[]> {
    let selectOptions: Prisma.RoomSelect
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new RoomAdminSelect()
        break
      case Role.MANAGER:
        selectOptions = new RoomManagerSelect()
        break
      default:
        selectOptions = new RoomCommonSelect()
    }

    const rooms = (await this.prisma.room.findMany({
      where: {
        siteId: siteId,
        deletedAt: Role.ADMIN === user.activeProfile.role ? undefined : null
      },
      select: selectOptions
    })) as RoomCommonReturn[] | RoomManagerReturn[] | RoomAdminReturn[]

    return rooms
  }

  async getOneRoomFromSite (
    siteId: number,
    roomId: number,
    user: UserRequestModel
  ): Promise<RoomCommonReturn | RoomManagerReturn | RoomAdminReturn> {
    let selectOptions: Prisma.RoomSelect
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new RoomAdminWithExhibitionsSelect()
        break
      case Role.MANAGER:
        selectOptions = new RoomManagerWithExhibitionsSelect()
        break
      default:
        selectOptions = new RoomWithExhibitionsSelect()
    }

    const room = (await this.prisma.room.findUnique({
      where: {
        id: roomId,
        siteId: siteId,
        deletedAt: Role.ADMIN === user.activeProfile.role ? undefined : null
      },
      select: selectOptions
    })) as unknown as
      | RoomWithExhibitionsReturn
      | RoomManagerWithExhibitionsReturn
      | RoomAdminWithExhibitionsReturn

    if (!room) throw new NotFoundException('Room not found')

    return room
  }

  async createRoom (
    siteId: number,
    room: RoomManipulationModel
  ): Promise<RoomManagerReturn> {
    try {
      const createdRoom = await this.prisma.room.create({
        data: {
          ...room,
          siteId: siteId
        },
        select: new RoomManagerSelect()
      })

      return createdRoom as RoomManagerReturn
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Room name already exists in this site')
        }
      }
      // this.loggingService.log(LogCritiitemCategory.Critical, this.constructor.name, e)
      throw new InternalServerErrorException(
        'Error while creating room, please try again later. If the problem persists, contact the administrator'
      )
    }
  }

  async deleteRoom (roomId: number): Promise<RoomManagerReturn> {
    try {
      return (await this.prisma.room.update({
        where: { id: roomId, deletedAt: null },
        data: {
          deletedAt: new Date()
        },
        select: new RoomManagerSelect()
      })) as RoomManagerReturn
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Room not found')
        }
      }
      throw new InternalServerErrorException(
        'Error while deleting room, please try again later. If the problem persists, contact the administrator'
      )
    }
  }
}
