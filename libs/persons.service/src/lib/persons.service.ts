import {
  PrismaBaseService,
  PersonType,
  Prisma,
  Role
} from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { PersonManipulationModel } from '@noloback/api.request.bodies'
import {
  PersonAdminReturn,
  PersonCommonReturn,
  PersonDetailledReturn
} from '@noloback/api.returns'
import {
  PersonAdminSelect,
  PersonCommonSelect,
  PersonDetailledSelect
} from '@noloback/db.calls'
import { UtilsService } from '@noloback/utils.service'
import { FiltersGetMany } from 'models/filters-get-many'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class PersonsService {
  constructor (
    private prismaBase: PrismaBaseService,
    private utilsService: UtilsService //private loggingService: LoggerService
  ) {}

  async findAll (
    role: Role,
    filters: FiltersGetMany,
    personType?: PersonType | undefined,
    nameStart?: string | undefined,
    birthStart?: string | undefined,
    deathStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<PersonCommonReturn[] | PersonAdminReturn[]> {
    let selectOptions: Prisma.PersonSelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new PersonAdminSelect()
        break
      default:
        selectOptions = new PersonCommonSelect()
    }
    const persons: unknown[] = await this.prismaBase.person
      .findMany({
        skip: +filters.start,
        take: +filters.end - filters.start,
        select: selectOptions,
        where: {
          type: personType ? personType : undefined,
          name: nameStart ? { startsWith: nameStart, mode: 'insensitive' } : undefined,
          birthDate: birthStart ? { startsWith: birthStart, mode: 'insensitive' } : undefined,
          deathDate: deathStart ? { startsWith: deathStart, mode: 'insensitive' } : undefined,
          createdAt: {
            gte: createdAtGte ? new Date(createdAtGte) : undefined,
            lte: createdAtLte ? new Date(createdAtLte) : undefined,
          },
  
          deletedAt: role === Role.ADMIN ? undefined : null,
        },
        orderBy: {
          [filters.sort]: filters.order,
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    switch (role) {
      case Role.ADMIN:
        return persons as PersonAdminReturn[]
      default:
        return persons as PersonCommonReturn[]
    }
  }

  async findOne (
    id: number,
    role: Role
  ): Promise<PersonDetailledReturn | PersonAdminReturn> {
    let selectOptions: Prisma.PersonSelect

    switch (role) {
      case Role.ADMIN:
        selectOptions = new PersonAdminSelect()
        break
      default:
        selectOptions = new PersonDetailledSelect()
    }
    const person: unknown = await this.prismaBase.person
      .findUnique({
        where: { id: id, deletedAt: role === Role.ADMIN ? undefined : null },
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new BadRequestException('Person not found')
      })

    switch (role) {
      case Role.ADMIN:
        return person as PersonAdminReturn
      default:
        return person as PersonDetailledReturn
    }
  }

  async create (person: PersonManipulationModel): Promise<PersonAdminReturn> {
    return (await this.prismaBase.person
      .create({
        data: {
          name: person.name,
          bio: person.bio,
          birthDate: person.birthDate ? this.utilsService.parseCustomDate(person.birthDate) : undefined,
          deathDate: person.deathDate ? this.utilsService.parseCustomDate(person.deathDate) : undefined,
          type: person.type as unknown as PersonType,
          picture: person.picture
        },
        select: new PersonAdminSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })) as unknown as PersonAdminReturn
  }

  async update (
    id: number,
    updatedPerson: PersonManipulationModel
  ): Promise<PersonAdminReturn> {
    return (await this.prismaBase.person
      .update({
        where: { id: id },
        data: {
          name: updatedPerson.name,
          bio: updatedPerson.bio,
          birthDate: updatedPerson.birthDate ? this.utilsService.parseCustomDate(updatedPerson.birthDate) : undefined,
          deathDate: updatedPerson.deathDate ? this.utilsService.parseCustomDate(updatedPerson.deathDate) : undefined,
          type: updatedPerson.type as unknown as PersonType,
          picture: updatedPerson.picture
        },
        select: new PersonAdminSelect()
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })) as unknown as PersonAdminReturn
  }

  async delete (id: number): Promise<PersonAdminReturn> {
    return (await this.prismaBase.person.update({
      where: { id: id },
      data: { deletedAt: new Date() },
      select: new PersonAdminSelect()
    })) as unknown as PersonAdminReturn
  }
}
