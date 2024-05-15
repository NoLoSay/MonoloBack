import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request
} from '@nestjs/common'
import { ADMIN, Roles } from '@noloback/roles'
import { PersonsService } from '@noloback/persons.service'
import { PersonManipulationModel } from '@noloback/api.request.bodies'
import {
  PersonAdminReturn,
  PersonCommonReturn,
  PersonDetailledReturn
} from '@noloback/api.returns'
import { LoggerService } from '@noloback/logger-lib'

@Controller('persons')
export class PersonsController {
  constructor (private readonly personsService: PersonsService) {}

  @Get()
  async findAll (
    @Request() request: any
  ): Promise<PersonCommonReturn[] | PersonAdminReturn[]> {
    return this.personsService.findAll(request.user.activeProfile.role)
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<PersonDetailledReturn | PersonAdminReturn> {
    LoggerService.userLog(+request.user.activeProfile.id, 'GET', 'Person', +id)

    return this.personsService.findOne(id, request.user.activeProfile.role)
  }

  @Roles([ADMIN])
  @Post()
  async create (
    @Body() person: PersonManipulationModel
  ): Promise<PersonAdminReturn> {
    return this.personsService.create(person)
  }

  @Roles([ADMIN])
  @Put(':id')
  async update (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedPerson: PersonManipulationModel
  ): Promise<PersonAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'UPDATE',
      'Person',
      +id,
      JSON.stringify(request.body)
    );

    return this.personsService.update(id, updatedPerson)
  }

  @Roles([ADMIN])
  @Delete(':id')
  async delete (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<PersonAdminReturn> {
    LoggerService.sensitiveLog(
      +request.user.activeProfile.id,
      'DELETE',
      'Person',
      +id,
      JSON.stringify(request.body)
    );

    return this.personsService.delete(id)
  }
}
