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
import { SignLanguagesService } from '@noloback/sign.languages.service'
import { ADMIN, Roles } from '@noloback/roles'
import { LoggerService } from '@noloback/logger-lib'
import { Role, SignLanguage } from '@noloback/prisma-client-base'

@Controller('sign-languages')
export class SignLanguagesController {
  constructor (private readonly enumsService: SignLanguagesService) {}

  @Get()
  async getSignLanguages (
    @Request() request: any,
    @Query('displayAs') displayAs?: Role | undefined
  ): Promise<
    { id: number; name: string; code: string; color: string }[] | SignLanguage[]
  > {
    if (
      displayAs === Role.ADMIN &&
      request.user.activeProfile.role === Role.ADMIN
    ) {
      return await this.enumsService.getAdminSignLanguages()
    }
    return await this.enumsService.getSignLanguages()
  }

  @Roles([ADMIN])
  @Get('admin')
  async getAdminSignLanguages (): Promise<SignLanguage[]> {
    return await this.enumsService.getAdminSignLanguages()
  }

  @Roles([ADMIN])
  @Post()
  async createSignLanguages (
    @Request() request: any,
    @Body() body: any
  ): Promise<{ id: number; name: string; code: string; color: string }> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'CREATE',
      'Sign Language',
      0,
      JSON.stringify(body)
    )
    return await this.enumsService.create(body)
  }

  @Roles([ADMIN])
  @Patch(':id')
  async updateSignLanguages (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ id: number; name: string; code: string; color: string }> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Sign Language',
      +id,
      JSON.stringify(request.body)
    )
    return await this.enumsService.patch(id, request.body)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async deleteSignLanguages (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ id: number; name: string; code: string; color: string }> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'Sign Language',
      +id,
      ''
    )
    return await this.enumsService.delete(id)
  }
}
