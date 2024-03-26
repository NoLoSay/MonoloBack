import { Controller, Get, Query } from '@nestjs/common'
import { SitesService } from '@noloback/sites.service'

@Controller('search')
export class SearchController {

  constructor(private readonly sitesService: SitesService) {}

  @Get('sites')
  async search (
    @Query('q') query?: string | undefined,
    @Query('lng') lng?: string | undefined,
    @Query('lat') lat?: string | undefined,
    @Query('r') radius?: string | undefined
  ) {
    return this.sitesService.searchSiteInSquare(
      lng ? parseFloat(lng) : null,
      lat ? parseFloat(lat) : null,
      radius ? parseFloat(radius) : null,
      query
    )
  }
}