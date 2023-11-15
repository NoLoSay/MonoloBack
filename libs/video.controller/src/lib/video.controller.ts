import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger/dist';
import { Public } from '@noloback/auth.service';
import { VideoFile, VideoService } from '@noloback/video.service';
import { Multer } from 'multer';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Public()
  @Get(':id')
  @HttpCode(200)
  async getVideo(@Param('id') id: string): Promise<string> {
    const video = await this.videoService.getVideo(id);

    if (!video) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    return '<body><script src="https://geo.dailymotion.com/libs/player/xcdyd.js"></script><div id="my-dailymotion-player">Loading player...</div><script>dailymotion.createPlayer("my-dailymotion-player", { video: "' + video + '" }).then((player) => console.log(player)).catch((e) => console.error(e));</script></body>';
  }

  @ApiBody({ type: VideoFile })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createVideo(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const video = this.videoService.createVideo(file);

    return await video;
  }
}
