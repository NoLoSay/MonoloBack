import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { LoggerService } from '@noloback/logger-lib';
import {
  PrismaBaseService,
  SanctionType,
  Sanctions,
} from '@noloback/prisma-client-base';
import { UserRequestModel } from '@noloback/requests.constructor';
import { FiltersGetMany } from 'models/filters-get-many';

@Injectable()
export class SanctionsService {
  constructor(private prismaBase: PrismaBaseService) {}

  async count(
    userId?: number | undefined,
    issuerId?: number | undefined,
    issuerUserId?: number | undefined,
    reasonContains?: string | undefined,
    sanctionType?: SanctionType | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined,
    updatedAtGte?: string | undefined,
    updatedAtLte?: string | undefined,
    sanctionStartAtGte?: string | undefined,
    sanctionStartAtLte?: string | undefined,
    sanctionEndAtGte?: string | undefined,
    sanctionEndAtLte?: string | undefined,
  ) {
    return await this.prismaBase.sanctions.count({
      where: {
        userId: userId ? +userId : undefined,
        issuerId: issuerId ? +issuerId : undefined,
        issuer: issuerUserId ? { userId: +issuerUserId } : undefined,
        sanctionType: sanctionType ? sanctionType : undefined,

        reason: reasonContains
          ? {
              contains: reasonContains,
              mode: 'insensitive',
            }
          : undefined,

        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },
        updatedAt: {
          gte: updatedAtGte ? new Date(updatedAtGte) : undefined,
          lte: updatedAtLte ? new Date(updatedAtLte) : undefined,
        },
        sanctionStart: {
          gte: sanctionStartAtGte ? new Date(sanctionStartAtGte) : undefined,
          lte: sanctionStartAtLte ? new Date(sanctionStartAtLte) : undefined,
        },
        sanctionEnd: {
          gte: sanctionEndAtGte ? new Date(sanctionEndAtGte) : undefined,
          lte: sanctionEndAtLte ? new Date(sanctionEndAtLte) : undefined,
        },
      },
    });
  }

  async findAll(
    filters: FiltersGetMany,
    userId?: number | undefined,
    issuerId?: number | undefined,
    issuerUserId?: number | undefined,
    reasonContains?: string | undefined,
    sanctionType?: SanctionType | undefined,
    sanctionStartAtGte?: string | undefined,
    sanctionStartAtLte?: string | undefined,
    sanctionEndAtGte?: string | undefined,
    sanctionEndAtLte?: string | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined,
    updatedAtGte?: string | undefined,
    updatedAtLte?: string | undefined,
  ) {
    return await this.prismaBase.sanctions.findMany({
      skip: +filters.start,
      take: +filters.end - filters.start,
      where: {
        userId: userId ? +userId : undefined,
        issuerId: issuerId ? +issuerId : undefined,
        issuer: issuerUserId ? { userId: +issuerUserId } : undefined,
        sanctionType: sanctionType ? sanctionType : undefined,

        reason: reasonContains
          ? {
              contains: reasonContains,
              mode: 'insensitive',
            }
          : undefined,

        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },
        updatedAt: {
          gte: updatedAtGte ? new Date(updatedAtGte) : undefined,
          lte: updatedAtLte ? new Date(updatedAtLte) : undefined,
        },
        sanctionStart: {
          gte: sanctionStartAtGte ? new Date(sanctionStartAtGte) : undefined,
          lte: sanctionStartAtLte ? new Date(sanctionStartAtLte) : undefined,
        },
        sanctionEnd: {
          gte: sanctionEndAtGte ? new Date(sanctionEndAtGte) : undefined,
          lte: sanctionEndAtLte ? new Date(sanctionEndAtLte) : undefined,
        },
      },
      orderBy: {
        [filters.sort]: filters.order,
      },
      include: {
        issuer: true,
      },
    });
  }

  async findById(id: number) {
    return await this.prismaBase.sanctions.findUnique({
      where: {
        id: +id,
      },
      include: {
        issuer: true,
      },
    });
  }

  async create(
    user: UserRequestModel,
    targetUser: number,
    sanctionType: SanctionType,
    reason: string,
    sanctionStart?: string | undefined,
    sanctionEnd?: string | undefined,
  ) {
    return await this.prismaBase.sanctions.create({
      data: {
        issuer: {
          connect: {
            id: +user.activeProfile.id,
          },
        },
        user: {
          connect: {
            id: +targetUser,
          },
        },
        sanctionType: sanctionType,
        reason: reason,
        sanctionStart: sanctionStart ? new Date(sanctionStart) : undefined,
        sanctionEnd: sanctionEnd ? new Date(sanctionEnd) : undefined,
      },
    });
  }

  async update(
    user: UserRequestModel,
    sanctionId: number,
    targetUser: number,
    sanctionType: SanctionType,
    reason: string,
    sanctionStart?: string | undefined,
    sanctionEnd?: string | undefined,
  ) {
    return await this.prismaBase.sanctions.update({
      where: {
        id: +sanctionId,
      },
      data: {
        issuer: {
          connect: {
            id: +user.activeProfile.id,
          },
        },
        user: {
          connect: {
            id: +targetUser,
          },
        },
        sanctionType: sanctionType,
        reason: reason,
        sanctionStart: sanctionStart,
        sanctionEnd: sanctionEnd,
      },
    });
  }

  async patch(
    user: UserRequestModel,
    sanctionId: number,
    data: Partial<Sanctions>,
  ) {
    const before = await this.prismaBase.sanctions.findUnique({
      where: { id: +sanctionId },
    });
    const updated = await this.prismaBase.sanctions.update({
      where: {
        id: +sanctionId,
      },
      data: data,
    });
    if (updated) {
      LoggerService.sensitiveLog(
        user.activeProfile.id,
        'PATCH',
        'Sanctions',
        +sanctionId,
        JSON.stringify({
          before: before,
          after: data,
        }),
      );
    }
    return updated;
  }

  async delete(user: UserRequestModel, sanctionId: number) {
    LoggerService.sensitiveLog(
      user.activeProfile.id,
      'DELETE',
      'Sanctions',
      +sanctionId,
    );
    return await this.prismaBase.sanctions.update({
      where: {
        id: +sanctionId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private async getUserSanctions(sanctions: Sanctions[]): Promise<{
    banned: boolean;
    uploadBlocked: boolean;
    sanctions: Sanctions[];
  }> {
    const now = new Date(); // Get the current date and time

    const banned =
      sanctions.find(
        (sanction) =>
          sanction.deletedAt == undefined &&
          sanction.sanctionType === SanctionType.BAN &&
          now >= sanction.sanctionStart &&
          (sanction.sanctionEnd == undefined || now <= sanction.sanctionEnd),
      ) != undefined;

    const uploadBlocked =
      sanctions.find(
        (sanction) =>
          sanction.deletedAt == undefined &&
          sanction.sanctionType === SanctionType.BLOCK_UPLOAD &&
          now >= sanction.sanctionStart &&
          (sanction.sanctionEnd == undefined || now <= sanction.sanctionEnd),
      ) != undefined;

    return {
      banned: banned,
      uploadBlocked: uploadBlocked,
      sanctions: sanctions,
    };
  }

  async getUserSanctionsById(userId: number): Promise<{
    banned: boolean;
    uploadBlocked: boolean;
    sanctions: Sanctions[];
  }> {
    if (!userId) {
      return {
        banned: false,
        uploadBlocked: false,
        sanctions: [],
      };
    }

    const sanctions = await this.prismaBase.sanctions.findMany({
      where: {
        userId: +userId,
      },
    });

    return this.getUserSanctions(sanctions);
  }

  async getUserSanctionsByEmail(email: string): Promise<{
    banned: boolean;
    uploadBlocked: boolean;
    sanctions: Sanctions[];
  }> {
    if (!email) {
      return {
        banned: false,
        uploadBlocked: false,
        sanctions: [],
      };
    }

    const sanctions = await this.prismaBase.sanctions.findMany({
      where: {
        user: {
          email: email,
        },
      },
    });

    return this.getUserSanctions(sanctions);
  }
}
