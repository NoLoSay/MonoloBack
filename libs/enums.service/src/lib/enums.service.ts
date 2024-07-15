import { PrismaBaseService } from '@noloback/prisma-client-base'
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import {
  PersonTypeColorAdminReturn,
  PersonTypeColorCommonReturn,
  RoleColorAdminReturn,
  RoleColorCommonReturn,
  SiteTagColorAdminReturn,
  SiteTagColorCommonReturn,
  SiteTypeColorAdminReturn,
  SiteTypeColorCommonReturn,
  ValidationStatusColorAdminReturn,
  ValidationStatusColorCommonReturn
} from '@noloback/api.returns'
import { EnumColorManipulationModel } from '@noloback/api.request.bodies'
import {
  PersonTypeColorAdminSelect,
  PersonTypeColorCommonSelect,
  RoleColorAdminSelect,
  RoleColorCommonSelect,
  SiteTagColorAdminSelect,
  SiteTagColorCommonSelect,
  SiteTypeColorAdminSelect,
  SiteTypeColorCommonSelect,
  ValidationStatusColorAdminSelect,
  ValidationStatusColorCommonSelect
} from '@noloback/db.calls'

@Injectable()
export class EnumsService {
  constructor (private prismaBase: PrismaBaseService) {}

  isColor (color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color)
  }

  async getRolesColors (): Promise<RoleColorCommonReturn[]> {
    return this.prismaBase.roleColor.findMany({
      select: new RoleColorCommonSelect()
    })
  }

  async getAdminRolesColors (): Promise<RoleColorAdminReturn[]> {
    return this.prismaBase.roleColor.findMany({
      select: new RoleColorAdminSelect()
    })
  }

  async roleColorsPatch (
    id: number,
    body: EnumColorManipulationModel
  ): Promise<RoleColorAdminReturn> {
    if (!this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.roleColor.update({
        where: { id },
        data: body,
        select: new RoleColorAdminSelect()
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }

  async getValidationStatusesColors (): Promise<
    ValidationStatusColorCommonReturn[]
  > {
    return this.prismaBase.validationStatusColor.findMany({
      select: new ValidationStatusColorCommonSelect()
    })
  }

  async getAdminValidationStatusesColors (): Promise<
    ValidationStatusColorAdminReturn[]
  > {
    return this.prismaBase.validationStatusColor.findMany({
      select: new ValidationStatusColorAdminSelect()
    })
  }

  async validationStatusColorsPatch (
    id: number,
    body: EnumColorManipulationModel
  ): Promise<ValidationStatusColorAdminReturn> {
    if (!this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.validationStatusColor.update({
        where: { id },
        data: body,
        select: new ValidationStatusColorAdminSelect()
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }

  async getPersonTypesColors (): Promise<PersonTypeColorCommonReturn[]> {
    return this.prismaBase.personTypeColor.findMany({
      select: new PersonTypeColorCommonSelect()
    })
  }

  async getAdminPersonTypesColors (): Promise<PersonTypeColorAdminReturn[]> {
    return this.prismaBase.personTypeColor.findMany({
      select: new PersonTypeColorAdminSelect()
    })
  }

  async personTypeColorsPatch (
    id: number,
    body: EnumColorManipulationModel
  ): Promise<PersonTypeColorAdminReturn> {
    if (!this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.personTypeColor.update({
        where: { id },
        data: body,
        select: new PersonTypeColorAdminSelect()
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }

  async getSiteTypesColors (): Promise<SiteTypeColorCommonReturn[]> {
    return this.prismaBase.siteTypeColor.findMany({
      select: new SiteTypeColorCommonSelect()
    })
  }

  async getAdminSiteTypesColors (): Promise<SiteTypeColorAdminReturn[]> {
    return this.prismaBase.siteTypeColor.findMany({
      select: new SiteTypeColorAdminSelect()
    })
  }

  async siteTypeColorsPatch (
    id: number,
    body: EnumColorManipulationModel
  ): Promise<SiteTypeColorAdminReturn> {
    if (!this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.siteTypeColor.update({
        where: { id },
        data: body,
        select: new SiteTypeColorAdminSelect()
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }

  async getSiteTagsColors (): Promise<SiteTagColorCommonReturn[]> {
    return this.prismaBase.siteTagColor.findMany({
      select: new SiteTagColorCommonSelect()
    })
  }

  async getAdminSiteTagsColors (): Promise<SiteTagColorAdminReturn[]> {
    return this.prismaBase.siteTagColor.findMany({
      select: new SiteTagColorAdminSelect()
    })
  }

  async siteTagColorsPatch (
    id: number,
    body: EnumColorManipulationModel
  ): Promise<SiteTagColorAdminReturn> {
    if (!this.isColor(body.color)) {
      throw new BadRequestException('Color not valid')
    }
    try {
      return await this.prismaBase.siteTagColor.update({
        where: { id },
        data: body,
        select: new SiteTagColorAdminSelect()
      })
    } catch {
      throw new NotFoundException('Enum not found')
    }
  }
}
