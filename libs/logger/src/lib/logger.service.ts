import { Injectable } from '@nestjs/common';
import { LogCriticity, PrismaClient as PrismaBaseClient } from '@prisma/client/base';
import { PrismaBaseService } from '@noloback/prisma-client-base';

@Injectable()
export class LoggerService {
  constructor(
    private prismaBase: PrismaBaseService
  ) {}

  private static getCriticityColor(criticity: LogCriticity) {
    switch (criticity) {
      case LogCriticity.Critical: // purple
        return 0x9c27b0;
      case LogCriticity.High: // red
        return 0xe91e63;
      case LogCriticity.Medium: // yellow
        return 0xfbc02d;
      case LogCriticity.Low: // green
        return 0x2e7d32;
      case LogCriticity.Info: // blue
        return 0x2196f3;
      default:
        return 0x9c27b0;
    }
  }

  private static async getHookMessage(criticity: LogCriticity, e: any) {
    let hookMessage = '';
    if (criticity === LogCriticity.Critical || criticity === LogCriticity.High) {
      hookMessage = process.env['LOG_DISCORD_PING_IDS'] || '';
    }

    return await fetch(process.env['LOG_DISCORD_WEBHOOK_URL'], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          username: "Incident Back",
          content: hookMessage,
          embeds: [
            {
              title: criticity,
              color: this.getCriticityColor(criticity),
              "fields": [
                {
                  "name": "Context",
                  "value": e.context || 'N/A',
                  "inline": true
                },
                {
                  "name": "Message",
                  "value": e.message || 'N/A',
                  "inline": true
                },
                {
                  "name": "Content",
                  "value": e.content || 'N/A',
                  "inline": true
                },
                {
                  "name": "Exception",
                  "value": e.exception || 'N/A',
                  "inline": false
                },
                {
                  "name": "Stack",
                  "value": e.stack || 'N/A',
                  "inline": false,
                },
              ],
            },
          ],
        }
      ),
    });
  }

  async log(
    criticity: LogCriticity,
    context: string,
    exception: Error | undefined,
    message: string = ''
  ) {
    await this.prismaBase.logs
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
      .then(async (e) => {
        console.log(e);
        LoggerService.getHookMessage(criticity, e);
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
    const prisma: PrismaBaseClient = new PrismaBaseClient();

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
      .then(async (e) => {
        console.log(e);
        LoggerService.getHookMessage(criticity, e);
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
