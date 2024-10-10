import { Controller, Get } from "@nestjs/common";
import { Public } from "@noloback/jwt";
import { LoggerService } from '@noloback/logger-lib';
import { LogCriticity } from "@noloback/prisma-client-base";

@Controller('crash')
export class CrashController {
  constructor (private readonly loggingService: LoggerService) {}

  @Public()
  @Get('info')
  async getInfo() {
    this.loggingService.log(LogCriticity.Info, this.constructor.name, undefined, 'logged info');
    return {
      message: 'logged info',
    }
  }

  @Public()
  @Get('low')
  async getlow() {
    this.loggingService.log(LogCriticity.Low, this.constructor.name, undefined, 'logged low');
    return {
      message: 'logged low',
    }
  }

  @Public()
  @Get('medium')
  async getMedium() {
    this.loggingService.log(LogCriticity.Medium, this.constructor.name, undefined, 'logged medium');
    return {
      message: 'logged medium',
    }
  }

  @Public()
  @Get('high')
  async getHigh() {
    this.loggingService.log(LogCriticity.High, this.constructor.name, undefined, 'logged high');
    return {
      message: 'logged high',
    }
  }

  @Public()
  @Get('critical')
  async getCritical() {
    this.loggingService.log(LogCriticity.Critical, this.constructor.name, undefined, 'logged critical');
    return {
      message: 'logged critical',
    }
  }
}
