import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger/dist';
import { VideoFile } from '@noloback/models/swagger';
import { VideoService } from '@noloback/video.service';
import { JwtAuthGuard } from '@noloback/guards';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoservice: VideoService) {}

  @Get(':id')
  @HttpCode(200)
  async getYoutube(@Param('id') id: string): Promise<string> {
    const youtube = await this.videoservice.getYoutube(id);

    if (!youtube) {
      throw new HttpException('Youtube not found', HttpStatus.NOT_FOUND);
    }

    return '<body><script src="https://geo.dailymotion.com/libs/player/xcdyd.js"></script><div id="my-dailymotion-player">Loading player...</div><script>dailymotion.createPlayer("my-dailymotion-player", { youtube: "' + youtube + '" }).then((player) => console.log(player)).catch((e) => console.error(e));</script></body>';
  }

  @ApiBody({ type: VideoFile })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createYoutube(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const youtube = this.videoservice.createYoutube(file);

    return await youtube;
  }
}
