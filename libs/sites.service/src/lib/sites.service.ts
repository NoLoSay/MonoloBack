import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
  Site,
  SiteTag,
  SiteType,
  PrismaBaseService
} from '@noloback/prisma-client-base'
import { SiteManipulationModel } from './models/siteManipulation.model'
// import { LoggerService } from '@noloback/logger-lib';

@Injectable()
export class SitesService {
  constructor (
    private prismaBase: PrismaBaseService // private loggingService: LoggerService
  ) {}

  async findAll (): Promise<Site[]> {
    return await this.prismaBase.site.findMany({
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

  async findOne (id: number): Promise<Site | null> {
    return await this.prismaBase.site.findUnique({
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

  async create (site: SiteManipulationModel) {
    const newSite: Site = await this.prismaBase.site
      .create({
        data: {
          name: site.name,
          shortDescription: site.shortDescription,
          longDescription: site.longDescription,
          telNumber: site.telNumber,
          email: site.email,
          website: site.website,
          price: site.price,
          picture: site.picture,
          type: site.type as unknown as SiteType,
          tags: site.tags as unknown[] as SiteTag[],
          Address: {
            create: {
              houseNumber: site.address.houseNumber,
              street: site.address.street,
              zip: site.address.zip,
              otherDetails: site.address.otherDetails,
              latitude: site.address.latitude,
              longitude: site.address.longitude,
              City: {
                connect: {
                  id: site.address.cityId
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
      id: newSite.id,
      name: newSite.name,
      addressId: newSite.addressId
    }
  }

  async update (id: number, site: SiteManipulationModel) {
    const updatedSite: Site = await this.prismaBase.site
      .update({
        where: { id: id },
        data: {
          name: site.name,
          shortDescription: site.shortDescription,
          longDescription: site.longDescription,
          telNumber: site.telNumber,
          email: site.email,
          website: site.website,
          price: site.price,
          picture: site.picture,
          type: site.type as unknown as SiteType,
          tags: site.tags as unknown[] as SiteTag[],
          Address: {
            update: {
              houseNumber: site.address.houseNumber,
              street: site.address.street,
              zip: site.address.zip,
              otherDetails: site.address.otherDetails,
              latitude: site.address.latitude,
              longitude: site.address.longitude,
              City: {
                connect: {
                  id: site.address.cityId
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
      id: updatedSite.id,
      name: updatedSite.name,
      addressId: updatedSite.addressId
    }
  }

  async delete (id: number) {
    const deletedSite: Site = await this.prismaBase.site
      .delete({
        where: { id: id }
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return {
      id: deletedSite.id,
      name: deletedSite.name,
      address: deletedSite.addressId
    }
  }

  async searchSiteInSquare (
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

    const sites = await this.prismaBase.site
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

    return sites
  }
}
