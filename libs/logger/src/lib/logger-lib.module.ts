import { Module } from '@nestjs/common';

import { PrismaClientLogsModule } from '@noloback/prisma-client-logs';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [PrismaClientLogsModule],
})
export class LoggerLibModule {}
