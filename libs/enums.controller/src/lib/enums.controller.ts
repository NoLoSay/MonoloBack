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
  Request,
  Query
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
  async getRoles (
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined
  ): Promise<
    | { role: Role; color: string }[]
    | { id: number; role: Role; color: string }[]
  > {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminRolesColors()
    }
    return await this.enumsService.getRolesColors()
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
  async getValidationStatuses (
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined
  ): Promise<
    | { validationStatus: ValidationStatus; color: string }[]
    | { id: number; validationStatus: ValidationStatus; color: string }[]
  > {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminValidationStatusesColors()
    }
    return await this.enumsService.getValidationStatusesColors()
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
  async getPersonTypes (
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined
  ): Promise<
    | { personType: PersonType; color: string }[]
    | { id: number; personType: PersonType; color: string }[]
  > {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminPersonTypesColors()
    }
    return await this.enumsService.getPersonTypesColors()
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
  async getSiteTypes (
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined
  ): Promise<
    | { siteType: SiteType; color: string }[]
    | { id: number; siteType: SiteType; color: string }[]
  > {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminSiteTypesColors()
    }
    return await this.enumsService.getSiteTypesColors()
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
  async getSiteTags (
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined
  ): Promise<
    | { siteTag: SiteTag; color: string }[]
    | { id: number; siteTag: SiteTag; color: string }[]
  > {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminSiteTagsColors()
    }
    return await this.enumsService.getSiteTagsColors()
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
