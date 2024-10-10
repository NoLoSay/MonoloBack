import { Injectable } from '@nestjs/common';
import {
  LogCriticity,
  PrismaClient as PrismaLogsClient,
} from '@prisma/client/logs';
import { PrismaClient as PrismaBaseClient } from '@prisma/client/base';
import { PrismaLogsService } from '@noloback/prisma-client-logs';
import { PrismaBaseService } from '@noloback/prisma-client-base';

@Injectable()
export class LoggerService {
  constructor(
    private prismaLogs: PrismaLogsService,
    private prismaBase: PrismaBaseService
  ) {}

  async log(
    criticity: LogCriticity,
    context: string,
    exception: Error | undefined,
    message: string = ''
  ) {
    await this.prismaLogs.logs
      .create({
        data: {
          criticity: criticity,
          context: context,
          exception: exception?.name,
          content: exception?.message,
          stack: exception?.stack,
          message: message,
        },
      })
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  static async log(
    criticity: LogCriticity,
    context: string,
    exception: Error | undefined,
    message: string = ''
  ) {
    const prisma: PrismaLogsClient = new PrismaLogsClient();

    await prisma.logs
      .create({
        data: {
          criticity: criticity,
          context: context,
          exception: exception?.name,
          content: exception?.message,
          stack: exception?.stack,
          message: message,
        },
      })
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async userLog(profileId: number, action: string, object: string, objectId: number, details?: string) {
    await this.prismaBase.userActionLog.create({
      data: {
        profileId: +profileId,
        action: action,
        object: object,
        objectId: +objectId,
        details: details,
      },
    });
  }

  static async userLog(profileId: number, action: string, object: string, objectId: number, details?: string) {
    const prisma: PrismaBaseClient = new PrismaBaseClient();

    await prisma.userActionLog.create({
      data: {
        profileId: +profileId,
        action: action,
        object: object,
        objectId: +objectId,
        details: details,
      },
    });
  }

  async sensitiveLog(profileId: number, action: string, object: string, objectId: number, details?: string) {
    await this.prismaBase.sensitiveActionLog.create({
      data: {
        profileId: +profileId,
        action: action,
        object: object,
        objectId: +objectId,
        details: details,
      },
    });
  }

  static async sensitiveLog(profileId: number, action: string, object: string, objectId: number, details?: string) {
    const prisma: PrismaBaseClient = new PrismaBaseClient();

    await prisma.sensitiveActionLog.create({
      data: {
        profileId: +profileId,
        action: action,
        object: object,
        objectId: +objectId,
        details: details,
      },
    });
  }
}
