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
import { ADMIN, Roles } from '@noloback/roles'
import {
  PersonManipulationModel,
  PersonsService
} from '@noloback/persons.service'

@Controller('persons')
export class PersonsController {
  constructor (private readonly personsService: PersonsService) {}

  @Get()
  async findAll () {
    return this.personsService.findAll()
  }

  @Roles([ADMIN])
  @Get(':id')
  async findOne (@Param('id', ParseIntPipe) id: number) {
    return this.personsService.findOne(id)
  }

  @Roles([ADMIN])
  @Post()
  async create (@Body() person: PersonManipulationModel) {
    return this.personsService.create(person)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedPerson: PersonManipulationModel
  ) {
    return this.personsService.update(id, updatedPerson)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (@Param('id', ParseIntPipe) id: number) {
    return this.personsService.delete(id)
  }
}
