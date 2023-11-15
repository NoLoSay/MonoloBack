import { ApiProperty } from '@nestjs/swagger/dist';

export class VideoFile {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File;
}
