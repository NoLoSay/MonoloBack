import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import { ADMIN, MANAGER, Roles } from '@noloback/roles'
import {
  SiteManipulationModel,
  SitesService
} from '@noloback/sites.service'
import {
  SiteManagerAdditionModel,
  SiteManagerModificationModel,
  SitesManagersService
} from '@noloback/sites.managers.service'
import { JwtAuthGuard } from '@noloback/guards'
// import { LoggerService } from '@noloback/logger-lib'

@Controller('sites')
export class SitesController {
  constructor (
    private readonly sitesService: SitesService,
    private readonly sitesManagersService: SitesManagersService // private loggingService: LoggerService
  ) {}

  @Roles([ADMIN])
  @Get()
  async findAll () {
    return this.sitesService.findAll()
  }

  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.sitesService.findOne(id)
  }

  @Roles([ADMIN])
  @Post()
  async create (@Body() sites: SiteManipulationModel) {
    return this.sitesService.create(sites)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedSite: SiteManipulationModel
  ) {
    return this.sitesService.update(id, updatedSite)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.sitesService.delete(id)
  }

  @Roles([ADMIN, MANAGER])
  @Get(':id/managers')
  async findManagers (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (
      await this.sitesManagersService.isAllowedToModify(
        request.user.id,
        id
      )
    )
      return this.sitesManagersService.findManagers(id)
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, MANAGER])
  @Post(':id/managers')
  async addManager (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() managerRelationId: SiteManagerAdditionModel
  ) {
    if (
      (await this.sitesManagersService.isAllowedToModify(
        request.user.id,
        id
      )) &&
      (await this.sitesManagersService.isMainManagerOfSite(
        request.user.id,
        id
      ))
    )
      return this.sitesManagersService.addManager(id, managerRelationId)
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, MANAGER])
  @Delete(':id/managers/:managerId')
  async deleteManager (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('managerId', ParseIntPipe) managerId: number
  ) {
    if (
      (await this.sitesManagersService.isAllowedToModify(
        request.user.id,
        id
      )) &&
      (await this.sitesManagersService.isMainManagerOfSite(
        request.user.id,
        id
      ))
    )
      return this.sitesManagersService.deleteManager(id, managerId)
    throw new UnauthorizedException()
  }

  @Roles([ADMIN, MANAGER])
  @Put(':id/managers/:managerId')
  async updateManager (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('managerId', ParseIntPipe) managerRelationId: number,
    @Body() updatedRefRelation: SiteManagerModificationModel
  ) {
    if (
      (await this.sitesManagersService.isAllowedToModify(
        request.user.id,
        id
      )) &&
      (await this.sitesManagersService.isMainManagerOfSite(
        request.user.id,
        id
      ))
    )
      return this.sitesManagersService.updateManager(
        id,
        managerRelationId,
        updatedRefRelation
      )
    throw new UnauthorizedException()
  }
}
