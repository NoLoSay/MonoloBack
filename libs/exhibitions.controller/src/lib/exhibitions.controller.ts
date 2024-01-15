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

@Controller('exhibitions')
export class ExhibitionsController {
  constructor (private readonly exhibitionsService: ExhibitionsService) {}

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
}
