import { PrismaBaseService, City } from '@noloback/prisma-client-base'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CityManipulationModel } from './models/cityManipulation.model'
//import { LogCriticity } from '@prisma/client/logs'
//import { LoggerService } from '@noloback/logger-lib'

@Injectable()
export class CitiesService {
  private cities: City[] = []

  constructor (
    private prismaBase: PrismaBaseService
    //private loggingService: LoggerService
  ) {}

  async findAll (): Promise<City[]> {
    return await this.prismaBase.city.findMany()
  }

  async findOne (id: number): Promise<City | null> {
    return await this.prismaBase.city.findUnique({
      where: { id: id }
    })
  }

  async create (city: CityManipulationModel) {
    if (
      city.departmentId === undefined ||
      city.departmentId === null ||
      city.departmentId <= 0
    ) {
      throw new InternalServerErrorException(
        "CityId can't be null or empty"
      )
    }
    const newCity: City = await this.prismaBase.city
      .create({
        data: {
          name: city.name,
          zip: city.zip,
          latitude: city.latitude,
          longitude: city.longitude,
          Department: {
            connect: {
              id: city.departmentId
            }
          }
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException()
      })

    return {
      id: newCity.id,
      name: newCity.name
    }
  }

  async update (id: number, updatedCity: CityManipulationModel) {
    if (
      updatedCity.departmentId === undefined ||
      updatedCity.departmentId === null ||
      updatedCity.departmentId <= 0
    ) {
      throw new InternalServerErrorException(
        "CityId can't be null or empty"
      )
    }
    const updated: City = await this.prismaBase.city
      .update({
        where: { id: id },
        data: {
          name: updatedCity.name,
          zip: updatedCity.zip,
          latitude: updatedCity.latitude,
          longitude: updatedCity.longitude,
          Department: {
            connect: {
              id: updatedCity.departmentId
            }
          }
        }
      })
      .catch((e: Error) => {
        // this.loggingService.log(LogCriticity.Critical, this.constructor.name, e)
        throw new InternalServerErrorException()
      })

    return {
      id: updated.id,
      name: updated.name
    }
  }

  async delete (id: number) {
    await this.prismaBase.city.delete({
      where: { id: id }
    })
  }
}
