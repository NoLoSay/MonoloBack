import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service'

@Module({
  controllers: [],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsServiceModule {}
