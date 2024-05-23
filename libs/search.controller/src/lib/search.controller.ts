import { Controller, Get, Query, Request } from '@nestjs/common'
import { LoggerService } from '@noloback/logger-lib'
import { SitesService } from '@noloback/sites.service'

@Controller('search')
export class SearchController {

  constructor(private readonly sitesService: SitesService) {}

  @Get('sites')
  async search (
    @Request() request: any,
    @Query('q') query?: string | undefined,
    @Query('lng') lng?: string | undefined,
    @Query('lat') lat?: string | undefined,
    @Query('r') radius?: string | undefined
  ) {
    LoggerService.userLog(+request.user.activeProfile.id, 'GET', 'Search', +0, JSON.stringify({'query': query, 'lng': lng, 'lat': lat, 'radius': radius}))

    return this.sitesService.searchSiteInSquare(
      lng ? parseFloat(lng) : null,
      lat ? parseFloat(lat) : null,
      radius ? parseFloat(radius) : null,
      query,
      request.user.activeProfile.role
    )
  }
}