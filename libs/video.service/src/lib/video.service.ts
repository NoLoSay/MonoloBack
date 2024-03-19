import { google, youtube_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import {
  PrismaBaseService,
  ValidationStatus,
} from '@noloback/prisma-client-base';
import { LoggerService } from '@noloback/logger-lib';
import {
  VideoCommonListEntity,
  VideoCommonListReturn,
  VideoCommonListSelect,
} from './models/video.api.models';
import { FiltersGetMany } from 'models/filters-get-many';

export function getValidationStatusFromRole(
  role: 'ADMIN' | 'REFERENT' | 'USER'
): ValidationStatus[] {
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

  async getYoutube(video: any) {
    const fullVideo = {
      video: video,
      url: `https://www.youtube.com/embed/${video.externalProviderId}`,
    };

    return fullVideo;
  }

  async patchYoutubeValidation(uuid: string, validationStatus: ValidationStatus) {
    const video = await this.prismaBase.video.update({
      data: {
        validationStatus: validationStatus,
      },
      where: {
        uuid: uuid,
      },
    });

    return video;
  }

  async patchYoutubeValidationById(id: number, validationStatus: ValidationStatus) {
    const video = await this.prismaBase.video.update({
      data: {
        validationStatus: validationStatus,
      },
      where: {
        id: id,
      },
    });

    return video;
  }

  async getYoutubeByUUID(youtubeId: string) {
    const video = await this.prismaBase.video.findUnique({
      select: new VideoCommonListSelect(),
      where: {
        uuid: youtubeId,
      },
    });

    if (!video) {
      throw new NotFoundException();
    }

    return this.getYoutube(video);
  }

  async getYoutubeById(youtubeId: number) {
    const video = await this.prismaBase.video.findUnique({
      select: new VideoCommonListSelect(),
      where: {
        id: youtubeId,
      },
    });

    if (!video) {
      throw new NotFoundException();
    }

    return this.getYoutube(video);
  }

  async updateYoutubeValidation(uuid: string, status: ValidationStatus) {
    const video = await this.prismaBase.video.update({
      data: {
        validationStatus: status,
      },
      where: {
        uuid: uuid,
      },
    });

    return video;
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
    const videoEntities = (await this.prismaBase.video.findMany({
      where: {
        itemId: itemId,
        validationStatus: { in: getValidationStatusFromRole(role) },
      },
      select: new VideoCommonListSelect(),
      orderBy: {
        likedBy: {
          _count: 'desc',
        },
      },
    })) as unknown as VideoCommonListEntity[];

    const videos: VideoCommonListReturn[] = videoEntities.map(
      (entity) => new VideoCommonListReturn(entity)
    );

    return videos;
  }

  async getVideosFromUser(
    userId: number,
    role: 'ADMIN' | 'REFERENT' | 'USER' = 'USER'
  ): Promise<VideoCommonListReturn[]> {
    const videoEntities = (await this.prismaBase.video.findMany({
      where: {
        userId: userId,
        validationStatus: { in: getValidationStatusFromRole(role) },
      },
      select: new VideoCommonListSelect(),
    })) as unknown as VideoCommonListEntity[];

    const videos: VideoCommonListReturn[] = videoEntities.map(
      (entity) => new VideoCommonListReturn(entity)
    );
    return videos as VideoCommonListReturn[];
  }

  async countVideos(
    validationStatus?: ValidationStatus | undefined,
    itemId?: number | undefined,
    userId?: number | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<number> {
    return await this.prismaBase.video.count({
      where: {
        validationStatus: validationStatus ? validationStatus : undefined,
        itemId: itemId ? itemId : undefined,
        userId: userId ? userId : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },
      },
    });
  }

  async getAllVideos(
    filters: FiltersGetMany,
    validationStatus?: ValidationStatus | undefined,
    itemId?: number | undefined,
    userId?: number | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined
  ): Promise<VideoCommonListReturn[]> {
    const videoEntities = (await this.prismaBase.video.findMany({
      skip: filters.start,
      take: filters.end - filters.start,
      select: new VideoCommonListSelect(),
      where: {
        validationStatus: validationStatus ? validationStatus : undefined,
        itemId: itemId ? itemId : undefined,
        userId: userId ? userId : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },
      },
      orderBy: {
        [filters.sort]: filters.order,
      },
    })) as unknown as VideoCommonListEntity[];

    const videos: VideoCommonListReturn[] = videoEntities.map(
      (entity) => new VideoCommonListReturn(entity)
    );
    return videos as VideoCommonListReturn[];
  }
}
