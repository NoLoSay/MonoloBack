import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  Response,
  UnauthorizedException,
  Patch
} from '@nestjs/common'
import { ADMIN, MANAGER, Roles } from '@noloback/roles'
import { SitesService } from '@noloback/sites.service'
import {
  InviteManagerRequestBody,
  RemoveManagerRequestBody,
  SiteManagerModificationRequestBody,
  SiteManipulationRequestBody
} from '@noloback/api.request.bodies'
import { SitesManagersService } from '@noloback/sites.managers.service'
import { Role } from '@prisma/client/base'
// import { LoggerService } from '@noloback/logger-lib'

@Controller('sites')
export class SitesController {
  constructor (
    private readonly sitesService: SitesService,
    private readonly sitesManagersService: SitesManagersService // private loggingService: LoggerService
  ) {}

  @Get()
  async findAll (@Request() request: any, @Response() res: any) {
    return res.status(200).json(await this.sitesService.findAll(request.user))
  }

  @Get(':id')
  async findOne (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
    @Response() res: any
  ) {
    return res
      .status(200)
      .json(await this.sitesService.findOne(id, request.user))
  }

  @Roles([ADMIN])
  @Post()
  async create (
    @Response() res: any,
    @Body() sites: SiteManipulationRequestBody
  ) {
    return res.status(200).json(await this.sitesService.create(sites))
  }

  @Roles([ADMIN, MANAGER])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
    @Response() res: any,
    @Body() updatedSite: SiteManipulationRequestBody
  ) {
    if (await this.sitesManagersService.isAllowedToModify(request.user, id))
      return res
        .status(200)
        .json(await this.sitesService.update(id, updatedSite, request.user.activeProfile.role))
    throw new UnauthorizedException()
  }

  @Roles([ADMIN])
  @Patch(':id')
  async patch (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
  ) {
    return await this.sitesService.patch(id, request.body);
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number, @Response() res: any) {
    return res.status(200).json(await this.sitesService.delete(id))
  }

  @Roles([ADMIN, MANAGER])
  @Get(':id/managers')
  async findManagers (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Response() res: any
  ) {
    if (await this.sitesManagersService.isAllowedToModify(request.user, id))
      return res
        .status(200)
        .json(await this.sitesManagersService.findManagers(id))
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, MANAGER])
  @Post(':id/managers')
  async addManager (
    @Request() request: any,
    @Response() res: any,
    @Param('id', ParseIntPipe) siteId: number,
    @Body() invitation: InviteManagerRequestBody
  ) {
    if (
      request.user.activeProfile.role === ADMIN ||
      (await this.sitesManagersService.isMainManagerOfSite(
        request.user.activeProfile.id,
        siteId
      ))
    )
      return res
        .status(200)
        .json(
          await this.sitesManagersService.addManager(siteId, invitation.email)
        )
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, MANAGER])
  @Delete(':id/managers')
  async deleteManager (
    @Request() request: any,
    @Response() res: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() removedManager: RemoveManagerRequestBody
  ) {
    if (
      request.user.activeProfile.role == Role.ADMIN ||
      (await this.sitesManagersService.isMainManagerOfSite(
        request.user.activeProfile.id,
        id
      ))
    )
      return res
        .status(200)
        .json(await this.sitesManagersService.deleteManager(id, removedManager))
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, MANAGER])
  @Put(':id/managers')
  async updateManager (
    @Request() request: any,
    @Response() res: any,
    @Param('id', ParseIntPipe) siteId: number,
    @Body() updatedRelation: SiteManagerModificationRequestBody
  ) {
    if (
      request.user.activeProfile.role == Role.ADMIN ||
      (await this.sitesManagersService.isMainManagerOfSite(
        request.user.activeProfile.id,
        siteId
      ))
    )
      return res
        .status(200)
        .json(
          await this.sitesManagersService.updateManager(siteId, updatedRelation)
        )
    throw new UnauthorizedException()
  }
}
