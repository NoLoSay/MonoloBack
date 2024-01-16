import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe
} from '@nestjs/common'
import { Admin } from '@noloback/roles'
import {
  ExhibitionManipulationModel,
  ExhibitionsService
} from '@noloback/exhibitions.service'
import { ExhibitedObjectsService } from '@noloback/exhibited.objects.service'
import { ExhibitedObjectAdditionModel } from '@noloback/exhibited.objects.service'

@Controller('exhibitions')
export class ExhibitionsController {
  constructor (
    private readonly exhibitionsService: ExhibitionsService,
    private readonly exhibitedObjectsService: ExhibitedObjectsService
  ) {}

  @Get()
  async findAll () {
    return this.exhibitionsService.findAll()
  }

  @Admin()
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.exhibitionsService.findOne(id)
  }

  @Admin()
  @Post()
  async create (@Body() exhibitions: ExhibitionManipulationModel) {
    return this.exhibitionsService.create(exhibitions)
  }

  @Admin()
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedExhibition: ExhibitionManipulationModel
  ) {
    return this.exhibitionsService.update(id, updatedExhibition)
  }

  @Admin()
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.exhibitionsService.delete(id)
  }

  @Admin()
  @Get(':id/objects')
  async findExibitedObjects (@Param('id', ParseIntPipe) id: number) {
    return this.exhibitedObjectsService.findExibitedObjects(id)
  }

  @Admin()
  @Post(':id/objects')
  async addExhibitedObject (
    @Param('id', ParseIntPipe) id: number,
    @Body() addedObject: ExhibitedObjectAdditionModel
  ) {
    return this.exhibitedObjectsService.addExhibitedObject(id, addedObject)
  }

  @Admin()
  @Delete(':id/objects/:objectId')
  async deleteExhibitedObject (
    @Param('id', ParseIntPipe) id: number,
    @Param('objectId', ParseIntPipe) objectId: number
  ) {
    return this.exhibitedObjectsService.deleteExhibitedObject(id, objectId)
  }
}
