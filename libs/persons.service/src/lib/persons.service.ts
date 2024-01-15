import { PrismaBaseService, Person, PersonType } from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PersonManipulationModel } from './models/personManipulation.model'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class PersonsService {
  private persons: Person[] = []

  constructor (
    private prismaBase: PrismaBaseService
  ) //private loggingService: LoggerService
  {}

  async findAll (): Promise<Person[]> {
    return await this.prismaBase.person.findMany()
  }

  async findOne (id: number): Promise<Person | null> {
    return await this.prismaBase.person.findUnique({
      where: { id: id }
    })
  }

  async create (person: PersonManipulationModel) {
    const newPerson: Person = await this.prismaBase.person
      .create({
        data: {
          name: person.name,
          bio: person.bio,
          birthDate: person.birthDate,
          deathDate: person.deathDate,
          type: person.type as unknown as PersonType
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: newPerson.id,
      name: newPerson.name
    }
  }

  async update (id: number, updatedPerson: PersonManipulationModel) {
    const updated: Person = await this.prismaBase.person
      .update({
        where: { id: id },
        data: {
          name: updatedPerson.name,
          bio: updatedPerson.bio,
          birthDate: updatedPerson.birthDate,
          deathDate: updatedPerson.deathDate,
          type: updatedPerson.type as unknown as PersonType
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: updated.id,
      name: updated.name
    }
  }

  async delete (id: number) {
    await this.prismaBase.person.delete({
      where: { id: id }
    })
  }
}
