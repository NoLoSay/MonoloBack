import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { PicturesService } from '@noloback/pictures.service';
import { Public } from '@noloback/jwt';
import { Response } from 'express';
import * as path from 'path';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Get(':uuid')
  @Public()
  async findOne(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      uuid = uuid.replace(/\.[^/.]+$/, '');
      const pictureBuffer = await this.picturesService.getPicture(uuid);

      const picture = await this.picturesService.getPictureDetails(uuid);
      if (!picture) {
        throw new NotFoundException('Picture not found');
      }
      if (!picture.localPath) {
        throw new NotFoundException('Error while getting picture');
      }
      const extension = path.extname(picture.localPath).toLowerCase();
      let contentType = 'application/octet-stream';

      switch (extension) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
      }

      res.set({
        'Content-Type': contentType,
        'Content-Length': pictureBuffer.length,
      });

      res.send(pictureBuffer);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        res.status(404).send('Picture not found');
      } else {
        console.error(`Error serving picture: ${error.message}`);
        res.status(500).send('Internal Server Error');
      }
    }
  }
}
