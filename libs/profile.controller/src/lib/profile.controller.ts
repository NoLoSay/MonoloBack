import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  UseGuards,
  UnauthorizedException,
  Query,
  Response
} from '@nestjs/common'
import { ApiExtraModels } from '@nestjs/swagger'
import { ProfileService } from '@noloback/profile.service'

@Controller('profiles')
@ApiExtraModels()
export class ProfileController {
  constructor (private profileService: ProfileService) {}

  @Get()
  async getProfiles (@Request() request: any, @Response() res: any) {
    return res
      .status(200)
      .json(await this.profileService.getUserProfilesFromId(request.user.id, request.user.role))
  }

  @Get('active')
  async getActiveProfile (@Request() request: any, @Response() res: any) {
    return res.status(200).json(await this.profileService.getActiveProfile(request.user.id))
  }

  @Post('change')
  async changeActiveProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() profile: { profileId: number }
  ) {
    return res.status(200).json({ activeProfile: await this.profileService.changeActiveProfile(request.user.id, profile.profileId)})
  }
}
