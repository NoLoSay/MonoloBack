import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SignLanguagesService } from '@noloback/sign.languages.service';
import { ADMIN, Roles } from '@noloback/roles';
import { LoggerService } from '@noloback/logger-lib';
import { Role } from '@noloback/prisma-client-base';
import {
  SignLanguageAdminReturn,
  SignLanguageCommonReturn,
} from '@noloback/api.returns';
import {
  SignLanguageCreateRequestBody,
  SignLanguageModificationRequestBody,
} from '@noloback/api.request.bodies';

@Controller('sign-languages')
export class SignLanguagesController {
  constructor(private readonly enumsService: SignLanguagesService) {}

  @Get()
  async getSignLanguages(
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined,
  ): Promise<SignLanguageCommonReturn[] | SignLanguageAdminReturn[]> {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminSignLanguages();
    }
    return await this.enumsService.getSignLanguages();
  }

  @Roles([ADMIN])
  @Get('admin')
  async getAdminSignLanguages(): Promise<SignLanguageAdminReturn[]> {
    return await this.enumsService.getAdminSignLanguages();
  }

  @Roles([ADMIN])
  @Post()
  async createSignLanguages(
    @Request() request: any,
    @Body() body: SignLanguageCreateRequestBody,
  ): Promise<SignLanguageAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'CREATE',
      'SignLanguage',
      0,
      JSON.stringify(body),
    );
    return await this.enumsService.create(body);
  }

  @Roles([ADMIN])
  @Patch(':uuid')
  async updateSignLanguages(
    @Request() request: any,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() body: SignLanguageModificationRequestBody,
  ): Promise<SignLanguageAdminReturn> {
    const signLanguage: SignLanguageAdminReturn = await this.enumsService.patch(
      uuid,
      body,
    );
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'SignLanguage',
      +signLanguage.id,
      JSON.stringify(body),
    );
    return signLanguage;
  }

  @Roles([ADMIN])
  @Delete(':uuid')
  async deleteSignLanguages(
    @Request() request: any,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<SignLanguageAdminReturn> {
    const signLanguage: SignLanguageAdminReturn =
      await this.enumsService.delete(uuid);
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'SignLanguage',
      +signLanguage.id,
      '',
    );
    return signLanguage;
  }
}
