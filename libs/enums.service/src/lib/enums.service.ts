import {
  PrismaBaseService,
  Prisma,
  Role,
  ValidationStatus,
  PersonType,
  SiteType,
  SiteTag
} from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'

@Injectable()
export class EnumsService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  isColor (color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color)
  }

  async getRoles (): Promise<Role[]> {
    return Object.values(Role)
  }

  async getRolesColors (): Promise<{ role: Role; color: string }[]> {
    return this.prismaBase.roleColor.findMany({
      select: { role: true, color: true }
    })
  }

  async getAdminRolesColors (): Promise<
    { id: number; role: Role; color: string }[]
  > {
    return this.prismaBase.roleColor.findMany({})
  }

  async roleColorsPatch (
    id: number,
    body: any
  ): Promise<{ id: number; role: Role; color: string }> {
    if (body.color && !this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.roleColor.update({
        where: { id },
        data: body
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }

  async getValidationStatuses (): Promise<ValidationStatus[]> {
    return Object.values(ValidationStatus)
  }

  async getValidationStatusesColors (): Promise<
    { validationStatus: ValidationStatus; color: string }[]
  > {
    return this.prismaBase.validationStatusColor.findMany({
      select: { validationStatus: true, color: true }
    })
  }

  async getAdminValidationStatusesColors (): Promise<
    { id: number; validationStatus: ValidationStatus; color: string }[]
  > {
    return this.prismaBase.validationStatusColor.findMany({})
  }

  async validationStatusColorsPatch (
    id: number,
    body: any
  ): Promise<{
    id: number
    validationStatus: ValidationStatus
    color: string
  }> {
    if (body.color && !this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.validationStatusColor.update({
        where: { id },
        data: body
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }

  async getPersonTypes (): Promise<PersonType[]> {
    return Object.values(PersonType)
  }

  async getPersonTypesColors (): Promise<
    { personType: PersonType; color: string }[]
  > {
    return this.prismaBase.personTypeColor.findMany({
      select: { personType: true, color: true }
    })
  }

  async getAdminPersonTypesColors (): Promise<
    { id: number; personType: PersonType; color: string }[]
  > {
    return this.prismaBase.personTypeColor.findMany({})
  }

  async personTypeColorsPatch (
    id: number,
    body: any
  ): Promise<{ id: number; personType: PersonType; color: string }> {
    if (body.color && !this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.personTypeColor.update({
        where: { id },
        data: body
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }

  async getSiteTypes (): Promise<SiteType[]> {
    return Object.values(SiteType)
  }

  async getSiteTypesColors (): Promise<{ siteType: SiteType; color: string }[]> {
    return this.prismaBase.siteTypeColor.findMany({
      select: { siteType: true, color: true }
    })
  }

  async getAdminSiteTypesColors (): Promise<
    { id: number; siteType: SiteType; color: string }[]
  > {
    return this.prismaBase.siteTypeColor.findMany({})
  }

  async siteTypeColorsPatch (
    id: number,
    body: any
  ): Promise<{ id: number; siteType: SiteType; color: string }> {
    if (body.color && !this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.siteTypeColor.update({
        where: { id },
        data: body
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }

  async getSiteTags (): Promise<SiteTag[]> {
    return Object.values(SiteTag)
  }

  async getSiteTagsColors (): Promise<{ siteTag: SiteTag; color: string }[]> {
    return this.prismaBase.siteTagColor.findMany({
      select: { siteTag: true, color: true }
    })
  }

  async getAdminSiteTagsColors (): Promise<
    { id: number; siteTag: SiteTag; color: string }[]
  > {
    return this.prismaBase.siteTagColor.findMany({})
  }

  async siteTagColorsPatch (
    id: number,
    body: any
  ): Promise<{ id: number; siteTag: SiteTag; color: string }> {
    if (body.color && !this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.siteTagColor.update({
        where: { id },
        data: body
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }
}
