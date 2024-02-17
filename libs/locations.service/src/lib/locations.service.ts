import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
  Location,
  LocationTag,
  LocationType,
  PrismaBaseService
} from '@noloback/prisma-client-base'
import { LocationManipulationModel } from './models/locationManipulation.model'
// import { LoggerService } from '@noloback/logger-lib';

@Injectable()
export class LocationsService {
  constructor (
    private prismaBase: PrismaBaseService // private loggingService: LoggerService
  ) {}

  async findAll (): Promise<Location[]> {
    return await this.prismaBase.location.findMany({
      include: {
        Address: {
          include: {
            City: {
              select: {
                name: true,
                Department: {
                  select: {
                    name: true,
                    Country: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  async findOne (id: number): Promise<Location | null> {
    return await this.prismaBase.location.findUnique({
      where: { id: id },
      include: {
        Address: {
          include: {
            City: {
              select: {
                name: true,
                Department: {
                  select: {
                    name: true,
                    Country: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  async create (location: LocationManipulationModel) {
    const newLocation: Location = await this.prismaBase.location
      .create({
        data: {
          name: location.name,
          shortDescription: location.shortDescription,
          longDescription: location.longDescription,
          telNumber: location.telNumber,
          email: location.email,
          website: location.website,
          price: location.price,
          picture: location.picture,
          type: location.type as unknown as LocationType,
          tags: location.tags as unknown[] as LocationTag[],
          Address: {
            create: {
              houseNumber: location.address.houseNumber,
              street: location.address.street,
              zip: location.address.zip,
              otherDetails: location.address.otherDetails,
              latitude: location.address.latitude,
              longitude: location.address.longitude,
              City: {
                connect: {
                  id: location.address.cityId
                }
              }
            }
          }
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: newLocation.id,
      name: newLocation.name,
      addressId: newLocation.addressId
    }
  }

  async update (id: number, location: LocationManipulationModel) {
    const updatedLocation: Location = await this.prismaBase.location
      .update({
        where: { id: id },
        data: {
          name: location.name,
          shortDescription: location.shortDescription,
          longDescription: location.longDescription,
          telNumber: location.telNumber,
          email: location.email,
          website: location.website,
          price: location.price,
          picture: location.picture,
          type: location.type as unknown as LocationType,
          tags: location.tags as unknown[] as LocationTag[],
          Address: {
            update: {
              houseNumber: location.address.houseNumber,
              street: location.address.street,
              zip: location.address.zip,
              otherDetails: location.address.otherDetails,
              latitude: location.address.latitude,
              longitude: location.address.longitude,
              City: {
                connect: {
                  id: location.address.cityId
                }
              }
            }
          }
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: updatedLocation.id,
      name: updatedLocation.name,
      addressId: updatedLocation.addressId
    }
  }

  async delete (id: number) {
    const deletedLocation: Location = await this.prismaBase.location
      .delete({
        where: { id: id }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: deletedLocation.id,
      name: deletedLocation.name,
      address: deletedLocation.addressId
    }
  }

  async searchLocationInSquare (
    centerLng: number | null = null,
    centerLat: number | null = null,
    radius: number | null = null,
    name: string | null = null
  ) {
    const andArray: object[] = []

    if (centerLng && centerLat) {
      radius = radius || 5
      // Convert radius to degrees of latitude and longitude
      const dLat = radius / 111.2 // 1° latitude ≈ 111.2 km
      const dLng = radius / (111.2 * Math.cos(centerLat * (Math.PI / 180))) // 1° longitude depends on latitude

      // Compute square's limits
      const minLat = centerLat - dLat / 2
      const maxLat = centerLat + dLat / 2
      const minLng = centerLng - dLng / 2
      const maxLng = centerLng + dLng / 2

      andArray.push({
        Address: {
          latitude: {
            gte: minLat as number,
            lte: maxLat as number
          },
          longitude: {
            gte: minLng as number,
            lte: maxLng as number
          }
        }
      })
    }

    if (name) {
      andArray.push({
        name: {
          contains: name
        }
      })
    }

    const locations = await this.prismaBase.location
      .findMany({
        where: {
          AND: andArray
        },
        select: {
          id: true,
          name: true,
          Address: {
            select: {
              houseNumber: true,
              street: true,
              zip: true,
              otherDetails: true,
              latitude: true,
              longitude: true,
              City: {
                select: {
                  name: true,
                  Department: {
                    select: {
                      name: true,
                      Country: {
                        select: {
                          name: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return locations
  }
}
