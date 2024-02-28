import { Module } from '@nestjs/common';
import { LocationsReferentsService } from './locations.referents.service';
import { LoggerLibModule } from '@noloback/logger-lib';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base';
export { LocationReferentAdditionModel, LocationReferentModificationModel } from './models/locationReferentManipulation.model';


@Module({
  controllers: [],
  providers: [LocationsReferentsService],
  exports: [LocationsReferentsService],
  imports: [PrismaClientBaseModule, LoggerLibModule]
})
export class LocationsReferentsServiceModule {}
