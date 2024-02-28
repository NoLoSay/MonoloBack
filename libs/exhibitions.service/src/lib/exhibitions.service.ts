import { PrismaBaseService, Exhibition } from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ExhibitionManipulationModel } from './models/exhibitionManipulation.model'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class ExhibitionsService {
  constructor (
    private prismaBase: PrismaBaseService
    //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<Exhibition[]> {
    return await this.prismaBase.exhibition.findMany()
  }

  async findOne (id: number): Promise<Exhibition | null> {
    return await this.prismaBase.exhibition.findUnique({
      where: { id: id }
    })
  }

  async create (exhibition: ExhibitionManipulationModel) {
    if (
      exhibition.locationId === undefined ||
      exhibition.locationId === null ||
      exhibition.locationId <= 0
    ) {
      throw new InternalServerErrorException(
        "ExhibitionId can't be null or empty"
      )
    }
    const newExhibition: Exhibition = await this.prismaBase.exhibition
      .create({
        data: {
          name: exhibition.name,
          shortDescription: exhibition.shortDescription,
          longDescription: exhibition.longDescription,
          startDate: exhibition.startDate,
          endDate: exhibition.endDate,
          Location: {
            connect: {
              id: exhibition.locationId
            }
          }
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: newExhibition.id,
      name: newExhibition.name
    }
  }

  async update (id: number, updatedExhibition: ExhibitionManipulationModel) {
    if (
      updatedExhibition.locationId === undefined ||
      updatedExhibition.locationId === null ||
      updatedExhibition.locationId <= 0
    ) {
      throw new InternalServerErrorException(
        "ExhibitionId can't be null or empty"
      )
    }
    const updated: Exhibition = await this.prismaBase.exhibition
      .update({
        where: { id: id },
        data: {
          name: updatedExhibition.name,
          shortDescription: updatedExhibition.shortDescription,
          longDescription: updatedExhibition.longDescription,
          startDate: updatedExhibition.startDate,
          endDate: updatedExhibition.endDate,
          Location: {
            connect: {
              id: updatedExhibition.locationId
            }
          }
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
    await this.prismaBase.exhibition.delete({
      where: { id: id }
    })
  }
}
