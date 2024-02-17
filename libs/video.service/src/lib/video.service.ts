import { google, youtube_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import {
  PrismaBaseService,
  ValdationStatus,
  Video,
} from '@noloback/prisma-client-base';
import { LoggerService } from '@noloback/logger-lib';
import {
  VideoCommonListReturn,
  VideoCommonListSelect,
} from './models/video.api.models';

export function getValidationStatusFromRole(
  role: 'ADMIN' | 'REFERENT' | 'USER'
): ValdationStatus[] {
  switch (role) {
    case 'ADMIN':
      return ['VALIDATED', 'PENDING', 'REFUSED'];
    case 'REFERENT':
      return ['VALIDATED', 'PENDING'];
    default:
      return ['VALIDATED'];
  }
}

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
    const video = await this.prismaBase.video.findUnique({
      where: {
        uuid: youtubeId,
      },
    });

    if (!video) {
      throw new NotFoundException();
    }

    return video.externalProviderId;
  }

  // async createYoutube (
  //   user: User,
  //   video: Express.Multer.File,
  //   itemId: number
  // ): Promise<string> {
  //   const fileSize = statSync(video.path).size

  //   let res: any
  //   try {
  //     res = await this.youtube.videos.insert(
  //       {
  //         part: ['id', 'snippet', 'status'],
  //         requestBody: {
  //           snippet: {
  //             title: 'Test video',
  //             description: 'Test video',
  //             tags: ['tag1', 'tag2'],
  //             categoryId: '22'
  //           },
  //           status: {
  //             privacyStatus: 'private'
  //           }
  //         },
  //         media: {
  //           body: createReadStream(video.path)
  //         }
  //       },
  //       {
  //         onUploadProgress: event => {
  //           const progress = (event.bytesRead / fileSize) * 100
  //           console.log(`Progress: ${Math.round(progress)}%`)
  //         }
  //       }
  //     )
  //   } catch (e) {
  //     console.log(e)
  //   }

  //   if (!res.data.id || res.status !== 200) {
  //     this.loggerService.log(
  //       'Critical',
  //       'VideoService',
  //       undefined,
  //       JSON.stringify(res)
  //     )
  //     throw new InternalServerErrorException('Upload failed')
  //   }

  //   const noloVideo = await this.prismaBase.video.create({
  //     data: {
  //       externalProviderId: res?.data?.id || '',
  //       userId: user.id,
  //       itemId: itemId
  //     }
  //   })

  //   return noloVideo.uuid
  // }

  async getVideosFromItem(
    itemId: number,
    role: 'ADMIN' | 'REFERENT' | 'USER' = 'USER'
  ): Promise<VideoCommonListReturn[]> {
    const videos = await this.prismaBase.video.findMany({
      where: {
        itemId: itemId,
        validationStatus: { in: getValidationStatusFromRole(role) },
      },
      select: new VideoCommonListSelect(),
    });

    return videos as VideoCommonListReturn[];

    // let videosWithItems: VideoItemListReturn;

    // videosWithItems.videoList = videos;

    // return videosWithItems;
  }

  async getVideosFromUser(
    userId: number,
    role: 'ADMIN' | 'REFERENT' | 'USER' = 'USER'
  ): Promise<VideoCommonListReturn[]> {
    const videos = await this.prismaBase.video.findMany({
      where: {
        userId: userId,
        validationStatus: { in: getValidationStatusFromRole(role) },
      },
      select: new VideoCommonListSelect(),
    });

    return videos as VideoCommonListReturn[];
  }

  async getAllVideos(
    pageId: number,
    amount: number,
    validationStatus?: ValdationStatus | undefined,
    itemId?: number | undefined
  ): Promise<VideoCommonListReturn[]> {
    const videos = await this.prismaBase.video.findMany({
      skip: pageId * amount,
      take: amount,
      select: new VideoCommonListSelect(),
      where: {
        validationStatus: validationStatus ? validationStatus : undefined,
        itemId: itemId ? itemId : undefined,
      },
    });

    // return videos

    console.log(videos);

    return videos as VideoCommonListReturn[];
  }
}
