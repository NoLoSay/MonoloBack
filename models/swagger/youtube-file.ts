import { ApiProperty } from '@nestjs/swagger/dist';
import 'multer';

export class VideoFile {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  constructor(file: Express.Multer.File) {
    this.file = file;
  }
}
