import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
  Site,
  SiteTag,
  SiteType,
  PrismaBaseService,
  Prisma,
  Role
} from '@noloback/prisma-client-base'
import { SiteManipulationRequestBody } from '@noloback/api.request.bodies'
import {
  SiteCommonReturn,
  SiteManagerReturn,
  SiteAdminReturn
} from '@noloback/api.returns'
import {
  SiteCommonSelect,
  SiteManagerSelect,
  SiteAdminSelect
} from '@noloback/db.calls'
import { UserRequestModel } from '@noloback/requests.constructor'
import { SitesManagersService } from '@noloback/sites.managers.service'
// import { LoggerService } from '@noloback/logger-lib';

@Injectable()
export class SitesService {
  constructor (
    private readonly prismaBase: PrismaBaseService,
    private readonly sitesManagerService: SitesManagersService // private loggingService: LoggerService
  ) {}

  async findAll (
    user: UserRequestModel
  ): Promise<SiteCommonReturn[] | SiteAdminReturn[]> {
    let selectOptions: Prisma.SiteSelect
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new SiteAdminSelect()
        break
      default:
        selectOptions = new SiteCommonSelect()
    }

    const sites = (await this.prismaBase.site.findMany({
      select: selectOptions
    })) as unknown
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return sites as SiteAdminReturn[]
      default:
        return sites as SiteCommonReturn[]
    }
  }

  async findOne (
    id: number,
    user: UserRequestModel
  ): Promise<SiteCommonReturn | SiteManagerReturn | SiteAdminReturn> {
    let selectOptions: Prisma.SiteSelect
    console.log(user.activeProfile.role)
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new SiteAdminSelect()
        break
      case 'MANAGER':
        selectOptions = new SiteManagerSelect()
        break
      default:
        selectOptions = new SiteCommonSelect()
    }

    const site = (await this.prismaBase.site.findUnique({
      where: { id: id },
      select: selectOptions
    })) as unknown

    if (!site) throw new InternalServerErrorException('Site not found')
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return site as SiteAdminReturn
      case 'MANAGER':
        if (
          await this.sitesManagerService.isMainManagerOfSite(
            user.activeProfile.id,
            id
          )
        )
          return site as SiteManagerReturn
        else return site as SiteCommonReturn
      default:
        return site as SiteCommonReturn
    }
  }

  async create (site: SiteManipulationRequestBody) {
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
          address: {
            create: {
              houseNumber: site.address.houseNumber,
              street: site.address.street,
              zip: site.address.zip,
              otherDetails: site.address.otherDetails,
              latitude: site.address.latitude,
              longitude: site.address.longitude,
              city: {
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

  async update (id: number, site: SiteManipulationRequestBody) {
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
          address: {
            update: {
              houseNumber: site.address.houseNumber,
              street: site.address.street,
              zip: site.address.zip,
              otherDetails: site.address.otherDetails,
              latitude: site.address.latitude,
              longitude: site.address.longitude,
              city: {
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
        address: {
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
          address: {
            select: {
              houseNumber: true,
              street: true,
              zip: true,
              otherDetails: true,
              latitude: true,
              longitude: true,
              city: {
                select: {
                  name: true,
                  department: {
                    select: {
                      name: true,
                      country: {
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
