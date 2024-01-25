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
import { Admin } from '@noloback/roles'
import {
  ObjectManipulationModel,
  ObjectsService
} from '@noloback/objects.service'
import { JwtAuthGuard } from '@noloback/guards'
import { LocationsReferentsService } from '@noloback/locations.referents.service'

@Controller('objects')
export class ObjectsController {
  constructor (
    private readonly objectsService: ObjectsService,
    private readonly locationsReferentsService: LocationsReferentsService // private loggingService: LoggerService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll (@Request() request: any) {
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
  ) {
    return this.objectsService.findOne(id, request.user.role)
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
}
