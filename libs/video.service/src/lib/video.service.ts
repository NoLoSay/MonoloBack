import { google, youtube_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createReadStream, readFileSync, statSync } from 'fs';
import { PrismaBaseService, User } from '@noloback/prisma-client-base';
import { LoggerService } from '@noloback/logger-lib';

@Injectable()
export class VideoService {
  private auth: JWT;
  private youtube: youtube_v3.Youtube;

  constructor(
    private prismaBase: PrismaBaseService,
    private loggerService: LoggerService
  ) {
    const serviceAccount = JSON.parse(
      readFileSync('secrets/google-service-account.json', 'utf-8')
    );

    this.auth = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
      ],
      undefined
    );

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.auth,
    });
  }

  async getYoutube(youtubeId: string): Promise<string> {
    const video = await this.prismaBase.tmpVideo.findUnique({
      where: {
        uuid: youtubeId,
      },
    });

    if (!video) {
      throw new NotFoundException();
    }

    return video.providerId;
  }

  async createYoutube(user: User, video: Express.Multer.File): Promise<string> {
    const fileSize = statSync(video.path).size;

    let res: any;
    try {
      res = await this.youtube.videos.insert(
        {
          part: ['id', 'snippet', 'status'],
          requestBody: {
            snippet: {
              title: 'Test video',
              description: 'Test video',
              tags: ['tag1', 'tag2'],
              categoryId: '22',
            },
            status: {
              privacyStatus: 'private',
            },
          },
          media: {
            body: createReadStream(video.path),
          },
        },
        {
          onUploadProgress: (event) => {
            const progress = (event.bytesRead / fileSize) * 100;
            console.log(`Progress: ${Math.round(progress)}%`);
          },
        }
      );
    } catch (e) {
      console.log(e);
    }

    if (!res.data.id || res.status !== 200) {
      this.loggerService.log(
        'Critical',
        'VideoService',
        undefined,
        JSON.stringify(res)
      );
      throw new InternalServerErrorException('Upload failed');
    }

    const noloVideo = await this.prismaBase.tmpVideo.create({
      data: {
        providerId: res?.data?.id || '',
        userId: user.id,
      },
    });

    return noloVideo.uuid;
  }
}
