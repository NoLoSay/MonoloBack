import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  Response,
  Query
} from '@nestjs/common'
import { ADMIN, MANAGER, MODERATOR, Roles } from '@noloback/roles'
import { PersonsService } from '@noloback/persons.service'
import { PersonManipulationModel } from '@noloback/api.request.bodies'
import {
  PersonAdminReturn,
  PersonCommonReturn,
  PersonDetailledReturn
} from '@noloback/api.returns'
import { LoggerService } from '@noloback/logger-lib'
import { FiltersGetMany } from 'models/filters-get-many'
import { PersonType } from '@noloback/prisma-client-base'

@Controller('persons')
export class PersonsController {
  constructor (private readonly personsService: PersonsService) {}

  @Get()
  async findAll (
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 10,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('person_type') personType?: PersonType | undefined,
    @Query('name_start') nameStart?: string | undefined,
    @Query('birth_start') birthStart?: string | undefined,
    @Query('death_start') deathStart?: string | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined
  ): Promise<PersonCommonReturn[] | PersonAdminReturn[]> {
    const data = await this.personsService.findAll(request.user.activeProfile.role, new FiltersGetMany(firstElem, lastElem, sort, order, ['id', 'type', 'name', 'birthDate', 'deathDate', 'createdAt']), personType, nameStart, birthStart, deathStart, createdAtGte, createdAtLte)

    return res
    .set({
      'Access-Control-Expose-Headers': 'X-Total-Count',
      'X-Total-Count': data.length,
    })
    .json(
      data
    );
  }

  @Get(':id')
  async findOne (
    @Request() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<PersonDetailledReturn | PersonAdminReturn> {
    LoggerService.userLog(+request.user.activeProfile.id, 'GET', 'Person', +id)

    return this.personsService.findOne(id, request.user.activeProfile.role)
  }

  @Roles([ADMIN, MODERATOR, MANAGER])
  @Post()
  async create (
    @Body() person: PersonManipulationModel
  ): Promise<PersonAdminReturn> {
    return this.personsService.create(person)
  }

  @Roles([ADMIN, MODERATOR, MANAGER])
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
