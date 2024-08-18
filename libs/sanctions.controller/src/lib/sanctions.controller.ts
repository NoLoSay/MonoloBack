import { Controller, Get, HttpCode, Query, Request, Response } from "@nestjs/common";
import { SanctionType } from "@noloback/prisma-client-base";
import { SanctionsService } from "@noloback/sanctions.service";
import { FiltersGetMany } from "models/filters-get-many";

@Controller('sanctions')
export class SanctionsController {
  constructor(private readonly sanctionsService: SanctionsService) {}

  @Get()
  @HttpCode(200)
  async getAll(
    @Request() request: any,
    @Response() res: any,
    @Query('_start') firstElem: number = 0,
    @Query('_end') lastElem: number = 50,
    @Query('_sort') sort?: string | undefined,
    @Query('_order') order?: 'asc' | 'desc' | undefined,
    @Query('user') userId?: number | undefined,
    @Query('issuer') issuerId?: number | undefined,
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
      Object.values(sanctionType).includes(
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
    userId, issuerId, reasonContains, sanctionTypeEnum,
    sanctionStartAtGte, sanctionStartAtLte, sanctionEndAtGte, sanctionEndAtLte,
    createdAtGte, createdAtLte, updatedAtGte, updatedAtLte);

    return res
      .set({
        'Access-Control-Expose-Headers': 'X-Total-Count',
        'X-Total-Count': this.sanctionsService.count(userId, issuerId, reasonContains, sanctionTypeEnum,
          sanctionStartAtGte, sanctionStartAtLte, sanctionEndAtGte, sanctionEndAtLte,
          createdAtGte, createdAtLte, updatedAtGte, updatedAtLte),
      })
      .json(
        data
      );
  }
}
