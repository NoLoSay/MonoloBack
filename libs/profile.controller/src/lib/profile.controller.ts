import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Response,
  Delete
} from '@nestjs/common'
import { ApiExtraModels } from '@nestjs/swagger'
import { ProfileService } from '@noloback/profile.service'
import { ProfileListReturn, ProfileCommonReturn } from '@noloback/api.returns'
import { ADMIN, MODERATOR, REFERENT, Roles } from '@noloback/roles'

@Controller('profiles')
@ApiExtraModels()
export class ProfileController {
  constructor (private profileService: ProfileService) {}

  @Get()
  async getProfiles (
    @Request() request: any,
    @Response() res: any
  ): Promise<ProfileListReturn[]> {
    return res
      .status(200)
      .json(
        await this.profileService.getUserProfiles(
          request.user
        )
      )
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
    @Body() profile: { profileId: number }
  ): Promise<ProfileCommonReturn> {
    return res.status(200).json({
      activeProfile: await this.profileService.changeActiveProfile(
        request.user.id,
        profile.profileId
      )
    })
  }

  @Roles([ADMIN])
  @Post('create/admin')
  async createAdminProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() whoPromote: { userId: number }
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
    @Body() whoUnpromote: { userId: number }
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
    @Body() whoPromote: { userId: number }
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
    @Body() whoUnpromote: { userId: number }
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

  // @Roles([ADMIN, REFERENT])
  // @Post('create/referent')
  // async createReferentProfile (
  //   @Request() request: any,
  //   @Response() res: any,
  //   @Body() body: {userId: number}
  // ): Promise<ProfileCommonReturn> {
  //   return res
  //     .status(200)
  //     .json(
  //       await this.profileService.createReferentProfile(request.user.id, userId)
  //     )
  // }

  // @Roles([ADMIN, REFERENT])
  // @Delete('delete/referent')
  // async deleteReferentProfile (
  //   @Request() request: any,
  //   @Response() res: any,
  //   @Body() body: {userId: number}
  // ): Promise<ProfileCommonReturn> {
  //   return res
  //     .status(200)
  //     .json(
  //       await this.profileService.deleteReferentProfile(request.user.id, userId)
  //     )
  // }
}
