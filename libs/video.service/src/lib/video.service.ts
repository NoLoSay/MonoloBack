import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Multer } from 'multer';

@Injectable()
export class VideoService {
  constructor(private readonly httpService: HttpService) {}

  async getVideo(videoId: string): Promise<string | undefined> {
    return videoId;
  }

  async createVideo(video: Express.Multer.File): Promise<string> {
    const uploadUrl = await this.getUploadVideoUrl();
    const videoCreationUrl = await this.uploadVideo(video, uploadUrl);
    const distVideoId = await this.createDistVideo(videoCreationUrl);
    const publishedVideoId = await this.publishVideo(distVideoId);

    return publishedVideoId;
  }

  private async getUploadVideoUrl(): Promise<string> {
    const videoUploadUrl = 'https://api.dailymotion.com/file/upload';

    const uploadUrl$ = this.httpService.get(videoUploadUrl);
    const uploadUrl = await lastValueFrom(uploadUrl$);

    return uploadUrl.data.upload_url;
  }

  private async uploadVideo(
    video: Express.Multer.File,
    uploadUrl: string
  ): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([video.buffer], { type: video.mimetype });

    formData.append('file', blob, 'video.mp4');

    const response$ = this.httpService.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const uploadedVideo = await lastValueFrom(response$);

    return uploadedVideo.data.url;
  }

  private async createDistVideo(creationUrl: string): Promise<string> {
    const videoCreationUrl = `https://api.dailymotion.com/user/${process.env['DAILYMOTION_USER_ID']}/videos`;

    const response$ = this.httpService.post(videoCreationUrl, {
      data: {
        url: creationUrl,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const uploadedVideo = await lastValueFrom(response$);

    return uploadedVideo.data.id;
  }

  private async publishVideo(videoId: string): Promise<string> {
    const videoPublishUrl = `https://api.dailymotion.com/video/${videoId}`;

    const response$ = this.httpService.post(videoPublishUrl, {
      data: {
        published: true,
        is_created_for_kids: false,
      },
    });

    const publishedVideo = await lastValueFrom(response$);

    return publishedVideo.data.id;
  }
}
