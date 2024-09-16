import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import {
  Site,
  SiteTag,
  SiteType,
  Picture,
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
import { PicturesService } from '@noloback/pictures.service'
import { FiltersGetMany } from 'models/filters-get-many'

@Injectable()
export class SitesService {
  constructor (
    private readonly prismaBase: PrismaBaseService,
    private readonly picturesService: PicturesService,
    private readonly sitesManagerService: SitesManagersService // private loggingService: LoggerService
  ) {}

  async count (
    user: UserRequestModel,
    filters: FiltersGetMany,
    nameStart?: string | undefined,
    telStart?: string | undefined,
    emailStart?: string | undefined,
    websiteContains?: string | undefined,
    price?: number | undefined,
    type?: SiteType | undefined,
    addressId?: number | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<SiteCommonReturn[] | SiteAdminReturn[]> {
    const sites = (await this.prismaBase.site.findMany({
      where: {
        name: nameStart ? { startsWith: nameStart, mode: 'insensitive' } : undefined,
        telNumber: telStart ? { startsWith: telStart, mode: 'insensitive' } : undefined,
        email: emailStart ? { startsWith: emailStart, mode: 'insensitive' } : undefined,
        website: websiteContains ? { contains: websiteContains, mode: 'insensitive' } : undefined,
        price: price ? +price : undefined,
        type: type ? type : undefined,
        addressId: addressId ? +addressId : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },

        deletedAt: user.activeProfile.role === Role.ADMIN ? undefined : null,
      },
    })) as unknown
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return sites as SiteAdminReturn[]
      default:
        return sites as SiteCommonReturn[]
    }
  }

  async findAll (
    user: UserRequestModel,
    filters: FiltersGetMany,
    nameStart?: string | undefined,
    telStart?: string | undefined,
    emailStart?: string | undefined,
    websiteContains?: string | undefined,
    price?: number | undefined,
    type?: SiteType | undefined,
    addressId?: number | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
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
      skip: +filters.start,
      take: +filters.end - filters.start,
      select: selectOptions,
      where: {
        name: nameStart ? { startsWith: nameStart, mode: 'insensitive' } : undefined,
        telNumber: telStart ? { startsWith: telStart, mode: 'insensitive' } : undefined,
        email: emailStart ? { startsWith: emailStart, mode: 'insensitive' } : undefined,
        website: websiteContains ? { contains: websiteContains, mode: 'insensitive' } : undefined,
        price: price ? +price : undefined,
        type: type ? type : undefined,
        addressId: addressId ? +addressId : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },

        deletedAt: user.activeProfile.role === Role.ADMIN ? undefined : null,
      },
      orderBy: {
        [filters.sort]: filters.order,
      }
    })) as unknown
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return sites as SiteAdminReturn[]
      default:
        return sites as SiteCommonReturn[]
    }
  }

  async patch(id: number, body: any) {
    return await this.prismaBase.site.update({
      where: { id: id },
      data: body,
    })
  }

  async findOne (
    id: number,
    user: UserRequestModel
  ): Promise<SiteCommonReturn | SiteManagerReturn | SiteAdminReturn> {
    let selectOptions: Prisma.SiteSelect

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new SiteAdminSelect()
        break
      case Role.MANAGER:
        selectOptions = new SiteManagerSelect()
        break
      default:
        selectOptions = new SiteCommonSelect()
    }

    const site = (await this.prismaBase.site.findUnique({
      where: {
        id: id,
        deletedAt: user.activeProfile.role !== Role.ADMIN ? null : undefined
      },
      select: selectOptions
    })) as unknown

    if (!site) throw new InternalServerErrorException('Site not found')
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return site as SiteAdminReturn
      case Role.MANAGER:
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

  async create (site: SiteManipulationRequestBody, picture: Express.Multer.File): Promise<SiteAdminReturn> {
    let newPicture: Picture | undefined = undefined;

    if (picture) {
      newPicture = await this.picturesService.createPicture(picture.path);
    }

    if (site.addressId) {
     
    const newSite: any = await this.prismaBase.site
    .create({
      data: {
        name: site.name,
        shortDescription: site.shortDescription,
        longDescription: site.longDescription,
        telNumber: site.telNumber,
        email: site.email,
        website: site.website,
        price: +site.price,
        pictures: newPicture ? {
          connect: {
            id: newPicture.id
          }
        } : {},
        type: site.type as unknown as SiteType,
        tags: site.tags as unknown[] as SiteTag[],
        // addressId: site.addressId,
        address: {
          connect: {
            id: +site.addressId
          },
        }
      },
      select: new SiteAdminSelect()
    })
    .catch((e: Error) => {
      console.log(e)
      // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
      throw new InternalServerErrorException(e)
    })

    const managers = await this.prismaBase.siteHasManager.create({
      data: {
        isMain: true,
        profile: {
          connect: {
            id: +site.managerId
          }
        },
        site: {
          connect: {
            id: +newSite.id
          }
        }
      }
    })
    
  
  return newSite as SiteAdminReturn 
    }
    else if (site.address) {
    const newSite: any = await this.prismaBase.site
      .create({
        data: {
          name: site.name,
          shortDescription: site.shortDescription,
          longDescription: site.longDescription,
          telNumber: site.telNumber,
          email: site.email,
          website: site.website,
          price: +site.price,
          pictures: newPicture ? {
            connect: {
              id: newPicture.id
            }
          } : {},
          type: site.type as unknown as SiteType,
          tags: site.tags as unknown[] as SiteTag[],
          // addressId: site.addressId,
          address: {
            connectOrCreate: {
              where: {
                houseNumber_street_zip_cityId: {
                  houseNumber: site.address.houseNumber,
                  street: site.address.street,
                  zip: site.address.zip,
                  cityId: +site.address.cityId
                }
              },
              create: {
                houseNumber: site.address.houseNumber,
                street: site.address.street,
                zip: site.address.zip,
                otherDetails: site.address.otherDetails,
                latitude: +(site.address.latitude || 0),
                longitude: +(site.address.longitude || 0),
                city: {
                  connect: {
                    id: +site.address.cityId
                  }
                }
              }
            },
          }
        },
        select: new SiteAdminSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

      const managers = await this.prismaBase.siteHasManager.create({
        data: {
          isMain: true,
          profile: {
            connect: {
              id: +site.managerId
            }
          },
          site: {
            connect: {
              id: +newSite.id
            }
          }
        }
      })
      
    
    return newSite as SiteAdminReturn
    } else {
      throw new BadRequestException('No address provided')
    }
  }

  async update (
    id: number,
    site: SiteManipulationRequestBody,
    role: Role,
    picture?: Express.Multer.File
  ): Promise<SiteManagerReturn | SiteAdminReturn> {
    let selectOptions: Prisma.SiteSelect
    let newPicture: Picture | undefined = undefined;

    switch (role) {
      case Role.ADMIN:
        selectOptions = new SiteAdminSelect()
        break
      case Role.MANAGER:
        selectOptions = new SiteManagerSelect()
        break
      default:
        throw new ForbiddenException('You are not allowed to update this site')
    }

    if (picture) {
      newPicture = await this.picturesService.createPicture(picture.path);
    }

    const updatedSite: unknown = await this.prismaBase.site
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
          pictures: newPicture ? {
            set: {
              id: newPicture.id
            }
          } : {},
          type: site.type as unknown as SiteType,
          tags: site.tags as unknown[] as SiteTag[],
          // addressId: site.addressId,
          address: site.addressId ? {
            connect: {
              id: +site.addressId
            } 
          } : {},
          // address: {
          //   update: {
          //     houseNumber: site.address.houseNumber,
          //     street: site.address.street,
          //     zip: site.address.zip,
          //     otherDetails: site.address.otherDetails,
          //     latitude: site.address.latitude,
          //     longitude: site.address.longitude,
          //     city: {
          //       connect: {
          //         id: site.address.cityId
          //       }
          //     }
          //   }
          // }
        },
        select: selectOptions
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    switch (role) {
      case Role.ADMIN:
        return updatedSite as SiteAdminReturn
      default:
        return updatedSite as SiteManagerReturn
    }
  }

  async delete (id: number) {
    return (await this.prismaBase.site
      .update({
        where: { id: id },
        data: { deletedAt: new Date() },
        select: new SiteAdminSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })) as unknown as SiteAdminReturn
  }

  async searchSiteInSquare (
    centerLng: number | null = null,
    centerLat: number | null = null,
    radius: number | null = null,
    name: string | null = null,
    role: Role
  ): Promise<SiteCommonReturn[]> {
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

    if (role !== Role.ADMIN) {
      andArray.push({
        deletedAt: null
      })
    }

    const sites: unknown[] = await this.prismaBase.site
      .findMany({
        where: {
          AND: andArray
        },
        select: new SiteCommonSelect()
      })
      .catch((e: Error) => {
        console.log(e)
        // this.loggingService.log(LogCritiaddress.Critical, this.constructor.name, e)
        throw new InternalServerErrorException(e)
      })

    return sites as SiteCommonReturn[]
  }
}
