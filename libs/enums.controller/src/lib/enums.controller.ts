import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request
} from '@nestjs/common'
import { EnumsService } from '@noloback/enums.service'
import { ADMIN, Roles } from '@noloback/roles'
import { PersonType, Role, SiteTag, SiteType, ValidationStatus } from '@prisma/client/base'

@Controller('enums')
export class EnumsController {
  constructor (private readonly enumsService: EnumsService) {}

  @Get('roles')
  async getRoles (): Promise<{role:Role, color: string}[]> {
    return this.enumsService.getRolesColors()
  }

  @Get('validation-statuses')
  async getValidationStatuses (): Promise<{validationStatus:ValidationStatus, color: string}[]> {
    return this.enumsService.getValidationStatusesColors()
  }

  @Get('person-types')
  async getPersonTypes (): Promise<{personType:PersonType, color: string}[]> {
    return this.enumsService.getPersonTypesColors()
  }

  @Get('site-types')
  async getSiteTypes (): Promise<{siteType:SiteType, color: string}[]> {
    return this.enumsService.getSiteTypesColors()
  }


  @Get('site-tags')
  async getSiteTags (): Promise<{siteTag:SiteTag, color: string}[]> {
    return this.enumsService.getSiteTagsColors()
  }
}
