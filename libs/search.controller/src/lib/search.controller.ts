import { Controller, Get, Query, DefaultValuePipe } from '@nestjs/common'
import { LocationsService } from '@noloback/locations.service'

@Controller('search')
export class SearchController {

  constructor(private readonly locationsService: LocationsService) {}

  @Get('locations')
  async search (
    @Query('q') query?: string | undefined,
    @Query('lng') lng?: string | undefined,
    @Query('lat') lat?: string | undefined,
    @Query('r') radius?: string | undefined
  ) {
    return this.locationsService.searchLocationInSquare(
      lng ? parseFloat(lng) : null,
      lat ? parseFloat(lat) : null,
      radius ? parseFloat(radius) : null,
      query
    )
  }
}