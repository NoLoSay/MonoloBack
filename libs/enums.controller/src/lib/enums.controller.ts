import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request
} from '@nestjs/common'
import {
  PersonType,
  Role,
  SiteTag,
  SiteType,
  ValidationStatus
} from '@prisma/client/base'
import { EnumsService } from '@noloback/enums.service'
import { ADMIN, Roles } from '@noloback/roles'
import { LoggerService } from '@noloback/logger-lib'

@Controller('enums')
export class EnumsController {
  constructor (private readonly enumsService: EnumsService) {}

  @Get('roles')
  async getRoles (): Promise<{ role: Role; color: string }[]> {
    return await this.enumsService.getRolesColors()
  }

  @Roles([ADMIN])
  @Get('roles/admin')
  async getAdminRoles (): Promise<{ id: number; role: Role; color: string }[]> {
    return await this.enumsService.getAdminRolesColors()
  }

  @Roles([ADMIN])
  @Patch('roles/:id')
  async updateRoles (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ id: number; role: Role; color: string }> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Role Colors',
      +id,
      JSON.stringify(request.body)
    )
    return await this.enumsService.roleColorsPatch(id, request.body)
  }

  @Get('validation-statuses')
  async getValidationStatuses (): Promise<
    { validationStatus: ValidationStatus; color: string }[]
  > {
    return await this.enumsService.getValidationStatusesColors()
  }

  @Roles([ADMIN])
  @Get('validation-statuses/admin')
  async getAdminValidationStatuses (): Promise<
    { id: number; validationStatus: ValidationStatus; color: string }[]
  > {
    return await this.enumsService.getAdminValidationStatusesColors()
  }

  @Roles([ADMIN])
  @Patch('validation-statuses/:id')
  async updateValidationStatuses (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<{
    id: number
    validationStatus: ValidationStatus
    color: string
  }> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Validation Status Colors',
      +id,
      JSON.stringify(request.body)
    )
    return await this.enumsService.validationStatusColorsPatch(id, request.body)
  }

  @Get('person-types')
  async getPersonTypes (): Promise<{ personType: PersonType; color: string }[]> {
    return await this.enumsService.getPersonTypesColors()
  }

  @Roles([ADMIN])
  @Get('person-types/admin')
  async getAdminPersonTypes (): Promise<
    { id: number; personType: PersonType; color: string }[]
  > {
    return await this.enumsService.getAdminPersonTypesColors()
  }

  @Roles([ADMIN])
  @Patch('person-types/:id')
  async updatePersonTypes (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ id: number; personType: PersonType; color: string }> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Person Type Colors',
      +id,
      JSON.stringify(request.body)
    )
    return await this.enumsService.personTypeColorsPatch(id, request.body)
  }

  @Get('site-types')
  async getSiteTypes (): Promise<{ siteType: SiteType; color: string }[]> {
    return await this.enumsService.getSiteTypesColors()
  }

  @Roles([ADMIN])
  @Get('site-types/admin')
  async getAdminSiteTypes (): Promise<
    { id: number; siteType: SiteType; color: string }[]
  > {
    return await this.enumsService.getAdminSiteTypesColors()
  }

  @Roles([ADMIN])
  @Patch('site-types/:id')
  async updateSiteTypes (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ id: number; siteType: SiteType; color: string }> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Site Type Colors',
      +id,
      JSON.stringify(request.body)
    )
    return await this.enumsService.siteTypeColorsPatch(id, request.body)
  }

  @Get('site-tags')
  async getSiteTags (): Promise<{ siteTag: SiteTag; color: string }[]> {
    return await this.enumsService.getSiteTagsColors()
  }

  @Roles([ADMIN])
  @Get('site-tags/admin')
  async getAdminSiteTags (): Promise<
    { id: number; siteTag: SiteTag; color: string }[]
  > {
    return await this.enumsService.getAdminSiteTagsColors()
  }

  @Roles([ADMIN])
  @Patch('site-tags/:id')
  async updateSiteTags (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ id: number; siteTag: SiteTag; color: string }> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Site Tag Colors',
      +id,
      JSON.stringify(request.body)
    )
    return await this.enumsService.siteTagColorsPatch(id, request.body)
  }
}
