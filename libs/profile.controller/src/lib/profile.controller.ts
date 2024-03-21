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
import { JwtAuthGuard } from '@noloback/guards'
import { ProfileService } from '@noloback/profile.service'

@Controller('profiles')
@ApiExtraModels()
export class ProfileController {
  constructor (private profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfiles (@Request() request: any, @Response() res: any) {
    return res
      .status(200)
      .json(await this.profileService.getUserProfilesFromId(request.user.id))
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  async getActiveProfile (@Request() request: any, @Response() res: any) {
    return res.status(200).json(request.user.activeProfile)
  }

  @UseGuards(JwtAuthGuard)
  @Post('change')
  async changeActiveProfile (
    @Request() request: any,
    @Response() res: any,
    @Body() profile: { profileId: number }
  ) {
    return res.status(200).json({ activeProfile: await this.profileService.changeActiveProfile(request.user.id, profile.profileId)})
  }
}
