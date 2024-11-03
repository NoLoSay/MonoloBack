import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client/base';
import { EnumsService } from '@noloback/enums.service';
import { ADMIN, Roles } from '@noloback/roles';
import { LoggerService } from '@noloback/logger-lib';
import { EnumColorManipulationModel } from '@noloback/api.request.bodies';
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
  ValidationStatusColorCommonReturn,
} from '@noloback/api.returns';

@Controller('enums')
export class EnumsController {
  constructor(private readonly enumsService: EnumsService) {}

  @Get('roles')
  async getRoles(
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined,
  ): Promise<RoleColorCommonReturn[] | RoleColorAdminReturn[]> {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminRolesColors();
    }
    return await this.enumsService.getRolesColors();
  }

  @Roles([ADMIN])
  @Patch('roles/:id')
  async updateRoles(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EnumColorManipulationModel,
  ): Promise<RoleColorAdminReturn> {
    const updated: RoleColorAdminReturn =
      await this.enumsService.roleColorsPatch(id, body);
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'RoleColor',
      +updated.id,
      JSON.stringify(body),
    );
    return updated;
  }

  @Get('validation-statuses')
  async getValidationStatuses(
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined,
  ): Promise<
    ValidationStatusColorCommonReturn[] | ValidationStatusColorAdminReturn[]
  > {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminValidationStatusesColors();
    }
    return await this.enumsService.getValidationStatusesColors();
  }

  @Roles([ADMIN])
  @Patch('validation-statuses/:id')
  async updateValidationStatuses(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EnumColorManipulationModel,
  ): Promise<ValidationStatusColorAdminReturn> {
    const updated: ValidationStatusColorAdminReturn =
      await this.enumsService.validationStatusColorsPatch(id, body);
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'ValidationStatusColor',
      +updated.id,
      JSON.stringify(body),
    );
    return updated;
  }

  @Get('person-types')
  async getPersonTypes(
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined,
  ): Promise<PersonTypeColorCommonReturn[] | PersonTypeColorAdminReturn[]> {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminPersonTypesColors();
    }
    return await this.enumsService.getPersonTypesColors();
  }

  @Roles([ADMIN])
  @Patch('person-types/:id')
  async updatePersonTypes(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EnumColorManipulationModel,
  ): Promise<PersonTypeColorAdminReturn> {
    const updated: PersonTypeColorAdminReturn =
      await this.enumsService.personTypeColorsPatch(id, body);
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'PersonTypeColor',
      +updated.id,
      JSON.stringify(body),
    );
    return updated;
  }

  @Get('site-types')
  async getSiteTypes(
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined,
  ): Promise<SiteTypeColorCommonReturn[] | SiteTypeColorAdminReturn[]> {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminSiteTypesColors();
    }
    return await this.enumsService.getSiteTypesColors();
  }

  @Roles([ADMIN])
  @Patch('site-types/:id')
  async updateSiteTypes(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EnumColorManipulationModel,
  ): Promise<SiteTypeColorAdminReturn> {
    const updated: SiteTypeColorAdminReturn =
      await this.enumsService.siteTypeColorsPatch(id, body);
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'SiteTypeColor',
      +updated.id,
      JSON.stringify(body),
    );
    return updated;
  }

  @Get('site-tags')
  async getSiteTags(
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined,
  ): Promise<SiteTagColorCommonReturn[] | SiteTagColorAdminReturn[]> {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminSiteTagsColors();
    }
    return await this.enumsService.getSiteTagsColors();
  }

  @Roles([ADMIN])
  @Patch('site-tags/:id')
  async updateSiteTags(
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EnumColorManipulationModel,
  ): Promise<SiteTagColorAdminReturn> {
    const updated: SiteTagColorAdminReturn =
      await this.enumsService.siteTagColorsPatch(id, body);
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'SiteTagColor',
      +updated.id,
      JSON.stringify(body),
    );
    return updated;
  }
}
