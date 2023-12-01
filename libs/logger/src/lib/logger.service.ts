import { Injectable } from '@nestjs/common';
import { LogCriticity, PrismaClient } from '@prisma/client/logs';
import { PrismaLogsService } from '@noloback/prisma-client-logs';

@Injectable()
export class LoggerService {
  constructor(private prisma: PrismaLogsService) {}

  async log(
    criticity: LogCriticity,
    context: string,
    exception: Error,
    message: string = ''
  ) {
    await this.prisma.logs
      .create({
        data: {
          criticity: criticity,
          context: context,
          exception: exception.name,
          content: exception.message,
          stack: exception.stack,
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
    exception: Error,
    message: string = ''
  ) {
    const prisma: PrismaClient = new PrismaClient();

    await prisma.logs
      .create({
        data: {
          criticity: criticity,
          context: context,
          exception: exception.name,
          content: exception.message,
          stack: exception.stack,
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
}
