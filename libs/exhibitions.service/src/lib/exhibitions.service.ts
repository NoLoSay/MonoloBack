import {
  PrismaBaseService,
  Prisma,
  Role,
  LogCriticity,
} from '@noloback/prisma-client-base';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ExhibitionManipulationModel } from '@noloback/api.request.bodies';
import { UserRequestModel } from '@noloback/requests.constructor';
import {
  ExhibitionAdminDetailedReturn,
  ExhibitionAdminReturn,
  ExhibitionCommonDetailedReturn,
  ExhibitionCommonReturn,
  ExhibitionManagerDetailedReturn,
  ExhibitionManagerReturn,
} from '@noloback/api.returns';
import {
  ExhibitionAdminDetailedSelect,
  ExhibitionAdminSelect,
  ExhibitionCommonDetailedSelect,
  ExhibitionCommonSelect,
  ExhibitionManagerDetailedSelect,
  ExhibitionManagerSelect,
} from '@noloback/db.calls';
import { SitesManagersService } from '@noloback/sites.managers.service';
import {
  ExhibitionAdminDetailedDbReturn,
  ExhibitionCommonDetailedDbReturn,
  ExhibitionManagerDetailedDbReturn,
} from '@noloback/db.returns';
import { FiltersGetMany } from 'models/filters-get-many';
import { LoggerService } from '@noloback/logger-lib';

@Injectable()
export class ExhibitionsService {
  constructor(
    private readonly prismaBase: PrismaBaseService,
    private readonly siteManagersService: SitesManagersService,
    private loggingService: LoggerService,
  ) {}

  async count(
    siteId?: number | undefined,
    nameStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined,
  ): Promise<number> {
    return await this.prismaBase.exhibition.count({
      where: {
        siteId: siteId ? +siteId : undefined,
        name: nameStart
          ? { startsWith: nameStart, mode: 'insensitive' }
          : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },

        deletedAt: null,
      },
    });
  }

  async findAll(
    user: UserRequestModel,
    filters: FiltersGetMany,
    siteId?: number | undefined,
    nameStart?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined,
  ): Promise<ExhibitionCommonReturn[] | ExhibitionAdminReturn[]> {
    let selectOptions: Prisma.ExhibitionSelect;
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new ExhibitionAdminSelect();
        break;
      default:
        selectOptions = new ExhibitionCommonSelect();
    }

    const exhibitions: unknown[] = await this.prismaBase.exhibition.findMany({
      skip: +filters.start,
      take: +filters.end - filters.start,
      select: selectOptions,
      where: {
        siteId: siteId ? +siteId : undefined,
        name: nameStart
          ? { startsWith: nameStart, mode: 'insensitive' }
          : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },

        deletedAt: null,
      },
      orderBy: {
        [filters.sort]: filters.order,
      },
    });

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return exhibitions as ExhibitionAdminReturn[];
      default:
        return exhibitions as ExhibitionCommonReturn[];
    }
  }

  private async isManagerOfExhibition(
    user: UserRequestModel,
    exhibition: ExhibitionManagerDetailedDbReturn,
  ) {
    return await this.siteManagersService.isManagerOfSite(
      user.activeProfile.id,
      exhibition.site.id,
    );
  }

  async findOne(
    id: number,
    user: UserRequestModel,
  ): Promise<
    | ExhibitionAdminDetailedReturn
    | ExhibitionManagerDetailedReturn
    | ExhibitionCommonDetailedReturn
  > {
    let selectOptions: Prisma.ExhibitionSelect;
    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new ExhibitionAdminDetailedSelect();
        break;
      case Role.MANAGER:
        selectOptions = new ExhibitionManagerDetailedSelect();
        break;
      default:
        selectOptions = new ExhibitionCommonDetailedSelect();
    }
    const exhibition: unknown = await this.prismaBase.exhibition.findUnique({
      where: {
        id: +id,
        deletedAt: user.activeProfile.role === Role.ADMIN ? undefined : null,
      },
      select: selectOptions,
    });
    if (!exhibition) throw new NotFoundException('Exhibition not found');

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return new ExhibitionAdminDetailedReturn(
          exhibition as ExhibitionAdminDetailedDbReturn,
        );
      case Role.MANAGER:
        if (
          await this.isManagerOfExhibition(
            user,
            exhibition as ExhibitionManagerDetailedDbReturn,
          )
        )
          return new ExhibitionManagerDetailedReturn(
            exhibition as ExhibitionManagerDetailedDbReturn,
          );
        else
          return new ExhibitionCommonDetailedReturn(
            exhibition as ExhibitionCommonDetailedDbReturn,
          );

      default:
        return new ExhibitionCommonDetailedReturn(
          exhibition as ExhibitionCommonDetailedDbReturn,
        );
    }
  }

  async create(
    exhibition: ExhibitionManipulationModel,
  ): Promise<ExhibitionManagerReturn> {
    if (
      exhibition.siteId === undefined ||
      exhibition.siteId === null ||
      exhibition.siteId <= 0
    ) {
      throw new BadRequestException("siteId can't be null or empty");
    }
    const newExhibition: unknown = await this.prismaBase.exhibition
      .create({
        data: {
          name: exhibition.name,
          shortDescription: exhibition.shortDescription,
          longDescription: exhibition.longDescription,
          startDate: exhibition.startDate,
          endDate: exhibition.endDate,
          site: {
            connect: {
              id: +exhibition.siteId,
            },
          },
        },
        select: new ExhibitionManagerSelect(),
      })
      .catch((e: Error) => {
        console.log(e);
        this.loggingService.log(
          LogCriticity.Critical,
          this.constructor.name,
          e,
        );
        throw new InternalServerErrorException(e);
      });

    return newExhibition as ExhibitionManagerReturn;
  }

  async update(
    id: number,
    updatedExhibition: ExhibitionManipulationModel,
  ): Promise<ExhibitionManagerReturn> {
    if (
      updatedExhibition.siteId === undefined ||
      updatedExhibition.siteId === null ||
      updatedExhibition.siteId <= 0
    ) {
      throw new BadRequestException("siteId can't be null or empty");
    }
    const exhibition = await this.prismaBase.exhibition.findUnique({
      where: { id: +id, deletedAt: null },
      select: {
        id: true,
      },
    });
    if (!exhibition) throw new NotFoundException('Exhibition not found');

    const updated: unknown = await this.prismaBase.exhibition
      .update({
        where: { id: +id },
        data: {
          name: updatedExhibition.name,
          shortDescription: updatedExhibition.shortDescription,
          longDescription: updatedExhibition.longDescription,
          startDate: updatedExhibition.startDate,
          endDate: updatedExhibition.endDate,
          site: {
            connect: {
              id: +updatedExhibition.siteId,
            },
          },
        },
        select: new ExhibitionManagerSelect(),
      })
      .catch((e: Error) => {
        this.loggingService.log(
          LogCriticity.Critical,
          this.constructor.name,
          e,
        );
        throw new InternalServerErrorException('Error updating exhibition');
      });

    return updated as ExhibitionManagerReturn;
  }

  async delete(id: number) {
    await this.prismaBase.exhibition.update({
      where: { id: +id },
      data: {
        deletedAt: new Date(),
      },
      select: new ExhibitionAdminSelect(),
    });
  }
}
