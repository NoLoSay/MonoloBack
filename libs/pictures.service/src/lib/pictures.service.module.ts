import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'
import { UploadthingServiceModule } from '@noloback/uploadthing.service'

@Module({
  controllers: [],
  providers: [PicturesService],
  exports: [PicturesService],
  imports: [PrismaClientBaseModule, UploadthingServiceModule]
})
export class PicturesServiceModule {}
