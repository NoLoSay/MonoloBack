import { Injectable } from '@nestjs/common'
import { Prisma, PrismaBaseService, Role } from '@noloback/prisma-client-base'
import { UserRequestModel } from '@noloback/requests.constructor'
import { RoomAdminReturn, RoomCommonReturn, RoomManagerReturn } from '@noloback/api.returns'
import { RoomAdminSelect, RoomCommonSelect, RoomManagerSelect } from '@noloback/db.calls'

@Injectable()
export class RoomsService {
    constructor(private readonly prisma: PrismaBaseService) {}

    async getRoomsFromSite(siteId: number, user: UserRequestModel): Promise<RoomCommonReturn[] | RoomManagerReturn[] | RoomAdminReturn[] > {
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

        const rooms = await this.prisma.room.findMany({
            where: {
                siteId: siteId,
                deletedAt: Role.ADMIN === user.activeProfile.role ? undefined : null
            },
            select: selectOptions
        }) as RoomCommonReturn[] | RoomManagerReturn[] | RoomAdminReturn[]

        return rooms
    }

    // async getOneRoomFromSite(siteId: number, roomId: number, user: UserRequestModel): Promise<RoomCommonReturn | RoomManagerReturn | RoomAdminReturn> {
    //     let selectOptions: Prisma.RoomSelect
    //     switch (user.activeProfile.role) {
    //     case Role.ADMIN:
    //         selectOptions = new RoomAdminSelect()
    //         break
    //     case Role.MANAGER:
    //         selectOptions = new RoomManagerSelect()
    //         break
    //     default:
    //         selectOptions = new RoomCommonSelect()
    //     }

    //     const room = await this.prisma.room.findUnique({
    //         where: {
    //             id: roomId
    //         },
    //         select: selectOptions
    //     }) as RoomCommonReturn | RoomManagerReturn | RoomAdminReturn

    //     return room
    // }
}
