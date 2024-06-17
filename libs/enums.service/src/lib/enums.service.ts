import {
  PrismaBaseService,
  Prisma,
  Role,
  ValidationStatus,
  PersonType,
  SiteType,
  SiteTag
} from '@noloback/prisma-client-base'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EnumsService {
  constructor (
    private prismaBase: PrismaBaseService //private loggingService: LoggerService
  ) {}

  async getRoles (): Promise<Role[]> {
    return Object.values(Role)
  }

  async getRolesColors (): Promise<{role: Role, color: string}[]> {
    return this.prismaBase.roleColor.findMany({
      select: { role: true, color: true }
    })
  }

  async getValidationStatuses (): Promise<ValidationStatus[]> {
    return Object.values(ValidationStatus)
  }

  async getValidationStatusesColors (): Promise<{validationStatus: ValidationStatus, color: string}[]> {
    return this.prismaBase.validationStatusColor.findMany({
      select: { validationStatus: true, color: true }
    })
  }

  async getPersonTypes (): Promise<PersonType[]> {
    return Object.values(PersonType)
  }

  async getPersonTypesColors (): Promise<{personType: PersonType, color: string}[]> {
    return this.prismaBase.personTypeColor.findMany({
      select: { personType: true, color: true }
    })
  }

  async getSiteTypes (): Promise<SiteType[]> {
    return Object.values(SiteType)
  }

  async getSiteTypesColors (): Promise<{siteType: SiteType, color: string}[]> {
    return this.prismaBase.siteTypeColor.findMany({
      select: { siteType: true, color: true }
    })
  }

  async getSiteTags (): Promise<SiteTag[]> {
    return Object.values(SiteTag)
  }

  async getSiteTagsColors (): Promise<{siteTag: SiteTag, color: string}[]> {
    return this.prismaBase.siteTagColor.findMany({
      select: { siteTag: true, color: true }
    })
  }
}
