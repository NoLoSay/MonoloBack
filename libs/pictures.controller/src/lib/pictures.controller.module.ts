import { Module } from '@nestjs/common';
import { PicturesController } from './pictures.controller';
import { PicturesServiceModule } from '@noloback/pictures.service';

@Module({
  controllers: [PicturesController],
  providers: [],
  exports: [],
  imports: [PicturesServiceModule]
})
export class PicturesControllerModule {}
