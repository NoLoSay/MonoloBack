import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Response,
  Delete,
  Param,
  ParseIntPipe,
  Query
} from '@nestjs/common'
import { ApiExtraModels } from '@nestjs/swagger'
import { ProfileService } from '@noloback/profile.service'
import { ProfileListReturn, ProfileCommonReturn, ProfileUserAdminReturn } from '@noloback/api.returns'
import { ADMIN, MODERATOR, MANAGER, Roles } from '@noloback/roles'
import { SitesManagersService } from '@noloback/sites.managers.service'
import { ChangeProfileRequestBody, CreateAdminProfileRequestBody, CreateManagerProfileRequestBody, CreateModeratorProfileRequestBody, DeleteAdminProfileRequestBody, DeleteManagerProfileRequestBody, DeleteModeratorProfileRequestBody } from '@noloback/api.request.bodies'

@Controller('profiles')
@ApiExtraModels()
export class ProfileController {
  constructor (
    private readonly profileService: ProfileService,
    private readonly sitesManagerService: SitesManagersService
  ) {}

  @Get()
  async getProfiles (
    @Request() request: any,
    @Response() res: any,
    @Query('role') role?: string | undefined,
  ): Promise<ProfileListReturn[] | ProfileUserAdminReturn[]> {
    return res
      .status(200)
      .json(await this.profileService.getUserProfiles(request.user, role))
  }

  @Get('me')
  async getMyProfiles (
    @Request() request: any,
    @Response() res: any
  ): Promise<ProfileListReturn[]> {
    return res
      .status(200)
      .json(await this.profileService.getMyProfiles(request.user))
  }

  @Get('active')
  async getActiveProfile (
    @Request() request: any,
    @Response() res: any
  ): Promise<ProfileCommonReturn> {
    return res
      .status(200)
      .json(await this.profileService.getActiveProfile(request.user))
  }

  @Post('change')
  async changeActiveProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() profile: ChangeProfileRequestBody
  ): Promise<ProfileCommonReturn> {
    return res.status(200).json({
      activeProfile: await this.profileService.changeActiveProfile(
        request.user.id,
        profile.profileId
      )
    })
  }

  @Delete(':id')
  async deleteProfile (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
    @Response() res: any
  ): Promise<ProfileCommonReturn> {
    return res
      .status(200)
      .json(await this.profileService.deleteProfileById(request.user.id, id))
  }

  @Roles([ADMIN])
  @Post('create/admin')
  async createAdminProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() whoPromote: CreateAdminProfileRequestBody
  ): Promise<ProfileCommonReturn> {
    return res
      .status(200)
      .json(await this.profileService.createProfile(whoPromote.userId, ADMIN))
  }

  @Roles([ADMIN])
  @Delete('delete/admin')
  async deleteAdminProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() whoUnpromote: DeleteAdminProfileRequestBody
  ): Promise<ProfileCommonReturn> {
    return res
      .status(200)
      .json(
        await this.profileService.deleteUsersProfileByRole(
          whoUnpromote.userId,
          ADMIN
        )
      )
  }

  @Roles([ADMIN])
  @Post('create/moderator')
  async createModeratorProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() whoPromote: CreateModeratorProfileRequestBody
  ): Promise<ProfileCommonReturn> {
    return res
      .status(200)
      .json(
        await this.profileService.createProfile(whoPromote.userId, MODERATOR)
      )
  }

  @Roles([ADMIN])
  @Delete('delete/moderator')
  async deleteModeratorProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() whoUnpromote: DeleteModeratorProfileRequestBody
  ): Promise<ProfileCommonReturn> {
    return res
      .status(200)
      .json(
        await this.profileService.deleteUsersProfileByRole(
          whoUnpromote.userId,
          MODERATOR
        )
      )
  }

  @Roles([ADMIN])
  @Post('create/manager')
  async createManagerProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() whoPromote: CreateManagerProfileRequestBody
  ): Promise<ProfileCommonReturn> {
    return res
      .status(200)
      .json(await this.profileService.createProfile(whoPromote.userId, MANAGER))
  }

  @Roles([ADMIN])
  @Delete('delete/manager')
  async deleteManagerProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() whoUnpromote: DeleteManagerProfileRequestBody
  ): Promise<ProfileCommonReturn> {
    return res
      .status(200)
      .json(
        await this.profileService.deleteUsersProfileByRole(
          whoUnpromote.userId,
          MANAGER
        )
      )
  }
}
