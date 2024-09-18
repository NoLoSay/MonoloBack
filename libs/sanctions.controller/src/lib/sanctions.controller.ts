import { Controller, Delete, Get, HttpCode, Param, Post, Query, Request, Response } from "@nestjs/common";
import { SanctionType } from "@noloback/prisma-client-base";
import { SanctionsService } from "@noloback/sanctions.service";
import { FiltersGetMany } from "models/filters-get-many";
import { ADMIN, MODERATOR, Roles } from '@noloback/roles';

@Controller('sanctions')
export class SanctionsController {
  constructor(private readonly sanctionsService: SanctionsService) {}

  @Get()
  @HttpCode(200)
  @Roles([ADMIN, MODERATOR])
  async getAll(
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 50,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('target_user') userId?: number | undefined,
    @Query('issuer') issuerId?: number | undefined,
    @Query('issuer_user') issuerUserId?: number | undefined,
    @Query('reason_contains') reasonContains?: string | undefined,
    @Query('sanction_type') sanctionType?: string | undefined,
    @Query('sanctionStartAt_gte') sanctionStartAtGte?: string | undefined,
    @Query('sanctionStartAt_lte') sanctionStartAtLte?: string | undefined,
    @Query('sanctionEndAt_gte') sanctionEndAtGte?: string | undefined,
    @Query('sanctionEndAt_lte') sanctionEndAtLte?: string | undefined,
    @Query('createdAt_gte') createdAtGte?: string | undefined,
    @Query('createdAt_lte') createdAtLte?: string | undefined,
    @Query('updatedAt_gte') updatedAtGte?: string | undefined,
    @Query('updatedAt_lte') updatedAtLte?: string | undefined,
  ): Promise<string> {
    let sanctionTypeEnum: SanctionType | undefined;
    if (
      sanctionType &&
      Object.values(SanctionType).includes(
        sanctionType as SanctionType
      )
    ) {
      sanctionTypeEnum = sanctionType as unknown as SanctionType;
    }

    const data = await this.sanctionsService.findAll(
      new FiltersGetMany(
        firstElem,
        lastElem,
        sort,
        order,
        ['id', 'userId', 'issuerId', 'reason', 'sanctionType', 'sanctionStart', 'sanctionEnd', 'createdAt', 'updatedAt']
    ),
    userId, issuerId, issuerUserId, reasonContains, sanctionTypeEnum,
    sanctionStartAtGte, sanctionStartAtLte, sanctionEndAtGte, sanctionEndAtLte,
    createdAtGte, createdAtLte, updatedAtGte, updatedAtLte);

    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': this.sanctionsService.count(userId, issuerId, issuerUserId, reasonContains, sanctionTypeEnum,
          sanctionStartAtGte, sanctionStartAtLte, sanctionEndAtGte, sanctionEndAtLte,
          createdAtGte, createdAtLte, updatedAtGte, updatedAtLte),
      })
      .json(
        data
      );
  }

  @Post()
  @HttpCode(201)
  @Roles([ADMIN, MODERATOR])
  async create(@Request() request: any, @Response() res: any): Promise<string> {
    const data = await this.sanctionsService.create(request.user, request.body.target_user, request.body.sanction_type, request.body.reason, request.body.sanction_start, request.body.sanction_end);
    return res
      .status(201)
      .json(data);
  }

  @Delete(':id')
  @HttpCode(200)
  @Roles([ADMIN])
  async delete (@Request() request: any, @Response() res: any, @Param('id') id: number): Promise<string> {
    const data = await this.sanctionsService.delete(request.user, id);
    return res
      .status(200)
      .json(data);
  }

  @Get(':id')
  @HttpCode(200)
  @Roles([ADMIN, MODERATOR])
  async findById(@Request() request: any, @Response() res: any, @Param('id') id: number): Promise<string> {
    const data = await this.sanctionsService.findById(id);
    return res
      .status(200)
      .json(data);
  }
}
