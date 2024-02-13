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
import { Admin, Referent } from '@noloback/roles'
import {
  ObjectAdminReturn,
  ObjectCommonReturn,
  ObjectDetailedReturn,
  ObjectManipulationModel,
  ObjectsService
} from '@noloback/objects.service'
import { JwtAuthGuard } from '@noloback/guards'
import { LocationsReferentsService } from '@noloback/locations.referents.service'
import { VideoService } from '@noloback/video.service'

@Controller('objects')
export class ObjectsController {
  constructor (
    private readonly objectsService: ObjectsService,
    private readonly locationsReferentsService: LocationsReferentsService,
    private readonly videoService: VideoService
    // private loggingService: LoggerService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll (@Request() request: any): Promise<ObjectCommonReturn[] | ObjectAdminReturn[]> {
    return this.objectsService.findAll(request.user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Get('video-pending')
  async findAllVideoPendingObjects () {
    return this.objectsService.findAllVideoPendingObjects()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any
  ): Promise<ObjectDetailedReturn | ObjectAdminReturn>{
    return this.objectsService.findOneDetailled(id, request.user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create (
    @Request() request: any,
    @Body() objects: ObjectManipulationModel
  ) {
    if (request.user.role === 'ADMIN' || request.user.role === 'REFERENT')
      return this.objectsService.create(objects)
    throw new UnauthorizedException()
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedObject: ObjectManipulationModel
  ) {
    if (request.user.role === 'ADMIN' || request.user.role === 'REFERENT')
      return this.objectsService.update(id, updatedObject)
    throw new UnauthorizedException()
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.objectsService.delete(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/videos')
  async getVideos (
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any
  ) {
    return this.videoService.getVideosFromObject(id, request.user.role)
  }
}
