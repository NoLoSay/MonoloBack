import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PrismaClientBaseModule } from '@noloback/prisma-client-base'

@Module({
  controllers: [],
  providers: [PicturesService],
  exports: [PicturesService],
  imports: [PrismaClientBaseModule]
})
export class PicturesServiceModule {}
