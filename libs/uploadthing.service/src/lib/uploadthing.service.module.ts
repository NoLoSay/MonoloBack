import { Module } from '@nestjs/common';
import { UploadthingService } from './uploadthing.service';

@Module({
  controllers: [],
  providers: [UploadthingService],
  exports: [UploadthingService],
})
export class UploadthingServiceModule {}
