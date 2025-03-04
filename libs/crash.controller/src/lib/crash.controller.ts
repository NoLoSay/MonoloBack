import { Controller, Get } from '@nestjs/common';
import { Public } from '@noloback/jwt';
import { LoggerService } from '@noloback/logger-lib';
import { LogCriticity } from '@noloback/prisma-client-base';
import { ADMIN, Roles } from '@noloback/roles';

@Controller('crash')
export class CrashController {
  constructor(private readonly loggingService: LoggerService) {}

  @Roles([ADMIN])
  @Get('info')
  async getInfo() {
    this.loggingService.log(
      LogCriticity.Info,
      this.constructor.name,
      undefined,
      'cool',
    );
    return {
      message: 'logged info',
    };
  }

  @Roles([ADMIN])
  @Get('low')
  async getlow() {
    try {
      throw new Error('logged low');
    } catch (e: any) {
      this.loggingService.log(
        LogCriticity.Low,
        this.constructor.name,
        e,
        'yeahhhhhhh',
      );
    }
    return {
      message: 'logged low',
    };
  }

  @Roles([ADMIN])
  @Get('medium')
  async getMedium() {
    try {
      throw new Error('logged medium');
    } catch (e: any) {
      this.loggingService.log(
        LogCriticity.Medium,
        this.constructor.name,
        e,
        'kinda problematic',
      );
    }
    return {
      message: 'logged medium',
    };
  }

  @Roles([ADMIN])
  @Get('high')
  async getHigh() {
    try {
      throw new Error('logged high');
    } catch (e: any) {
      this.loggingService.log(
        LogCriticity.High,
        this.constructor.name,
        e,
        'actually problematic',
      );
    }
    return {
      message: 'logged high',
    };
  }

  @Roles([ADMIN])
  @Get('critical')
  async getCritical() {
    try {
      throw new Error('logged critical');
    } catch (e: any) {
      this.loggingService.log(
        LogCriticity.Critical,
        this.constructor.name,
        e,
        'extreme skill issue',
      );
    }
    return {
      message: 'logged critical',
    };
  }
}
