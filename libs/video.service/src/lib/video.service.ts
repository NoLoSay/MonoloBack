import { google, youtube_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import {
  BadRequestException,
  GoneException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ReadStream,
  Stats,
  createReadStream,
  readFileSync,
  statSync,
  unlink,
} from 'fs';
import {
  HostingProvider,
  Prisma,
  PrismaBaseService,
  Role,
  ValidationStatus,
  Video,
} from '@noloback/prisma-client-base';
import { LoggerService } from '@noloback/logger-lib';
import { FiltersGetMany } from 'models/filters-get-many';
import { UserRequestModel } from '@noloback/requests.constructor';
import { ProfileService } from '@noloback/profile.service';
import {
  VideoAdminReturn,
  VideoCommonReturn,
  VideoCreatorReturn,
  VideoManagerReturn,
  VideoModeratorReturn,
} from '@noloback/api.returns';
import {
  VideoAdminSelect,
  VideoCommonSelect,
  VideoCreatorSelect,
  VideoListedFromItemCommonSelect,
  VideoListedFromUserCommonSelect,
  VideoManagerSelect,
  VideoModeratorSelect,
} from '@noloback/db.calls';
import {
  VideoAdminDbReturn,
  VideoCommonDbReturn,
  VideoCreatorDbReturn,
  VideoListedFromItemCommonDbReturn,
  VideoModeratorDbReturn,
} from '@noloback/db.returns';
import { SitesManagersService } from '@noloback/sites.managers.service';
import multer = require('multer');

export function getValidationStatusFromRole(role: Role): ValidationStatus[] {
  switch (role) {
    case Role.ADMIN:
      return ['VALIDATED', 'PENDING', 'REFUSED'];
    case Role.MODERATOR:
      return ['VALIDATED', 'PENDING', 'REFUSED'];
    case Role.MANAGER:
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
    private loggerService: LoggerService,
    private readonly profileService: ProfileService,
    private sitesManagersService: SitesManagersService,
  ) {
    const serviceAccount = JSON.parse(
      readFileSync('secrets/google-service-account.json', 'utf-8'),
    );

    this.auth = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
      ],
      undefined,
    );

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.auth,
    });
  }

  async updateVideoShowcased(
    user: UserRequestModel,
    id: number,
    showcased: any,
  ) {
    showcased = showcased === 'true' || showcased === true;

    if (user.activeProfile.role === Role.MANAGER) {
      const video = await this.prismaBase.video.findFirst({
        where: {
          id: +id,
        },
      });
      if (!video) {
        throw new NotFoundException('Video not found');
      }

      const site = await this.prismaBase.site.findFirst({
        where: { items: { some: { id: +video?.itemId } } },
      });
      if (!site) {
        throw new InternalServerErrorException(
          'The item owning this video is not linked to a site',
        );
      }

      if (!(await this.sitesManagersService.isAllowedToModify(user, site.id))) {
        throw new UnauthorizedException(
          'You are not allowed to modify this resource',
        );
      }
    }

    return await this.prismaBase.video.update({
      where: {
        id: +id,
      },
      data: {
        showcased: showcased,
      },
    });
  }

  async setHostingProvider(
    videoId: number,
    newProviderId: number,
    newProviderVideoId: string,
  ) {
    const video = await this.prismaBase.video.update({
      data: {
        hostingProvider: {
          connect: {
            id: +newProviderId,
          },
        },
        hostingProviderVideoId: newProviderVideoId,
      },
      where: {
        id: +videoId,
      },
    });

    return video;
  }

  async patchVideo(videoId: number, body: any) {
    if (body.hostingProviderId !== 1) {
      const video = await this.getYoutubeById(+videoId);
      if (video?.video?.hostingProviderId === 1) {
        unlink(
          `${process.env['LOCAL_VIDEO_PATH']}/` +
            video.video.hostingProviderVideoId,
          (err) => {
            if (err) {
              console.error(err);
            }
          },
        );
      }
    }

    return await this.prismaBase.video.update({
      data: body,
      where: {
        id: +videoId,
      },
    });
  }

  async watchVideo(
    videoUUID: string,
  ): Promise<{ file: ReadStream; size: number }> {
    try {
      const video: Video = await this.prismaBase.video
        .findUniqueOrThrow({
          where: {
            uuid: videoUUID,
          },
        })
        .catch(() => {
          throw new NotFoundException();
        });

      const provider = await this.prismaBase.hostingProvider.findUnique({
        where: {
          id: +video.hostingProviderId,
        },
      });

      if (!provider) {
        throw new NotFoundException('Provider not found');
      }

      if (provider?.name !== 'NoLoSay')
        throw new BadRequestException('Provider not supported');
      // Redirect(
      //   provider.url
      //     .replace('${videoUUID}', video.uuid)
      //     .replace('$(providerVideoId)', video.hostingProviderVideoId)
      // );

      try {
        const videoPath = `/opt/nolovideos/${video.hostingProviderVideoId}`;
        const stats: Stats = statSync(videoPath);
        const size = stats.size;
        console.log('size', size);
        if (size) {
          const file = createReadStream(videoPath);
          return { file, size };
        } else {
          throw new GoneException('Video deleted');
        }
      } catch (e) {
        console.error(e);
        throw new GoneException('Video deleted');
      }
    } catch (e) {
      if (e instanceof GoneException) {
        throw new GoneException('Video deleted');
      }
      throw new InternalServerErrorException();
    }
  }

  async getYoutube(video: VideoCommonReturn) {
    const provider = await this.prismaBase.hostingProvider.findUnique({
      where: {
        id: +video.hostingProviderId,
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const fullVideo = {
      video: video,
      url: provider.url
        .replace('${videoUUID}', video.uuid)
        .replace('${providerVideoId}', video.hostingProviderVideoId),
    };

    return fullVideo;
  }

  async patchYoutubeValidation(id: number, validationStatus: ValidationStatus) {
    const video = await this.prismaBase.video.update({
      data: {
        validationStatus: validationStatus,
      },
      where: {
        id: +id,
      },
    });

    return video;
  }

  async getYoutubeByUUID(youtubeId: string) {
    const video: unknown = await this.prismaBase.video.findUnique({
      select: new VideoCommonSelect(),
      where: {
        uuid: youtubeId,
      },
    });

    if (!video) {
      throw new NotFoundException();
    }

    return this.getYoutube(new VideoCommonReturn(video as VideoCommonDbReturn));
  }

  async getYoutubeById(youtubeId: number) {
    const video: unknown = await this.prismaBase.video.findUnique({
      select: new VideoCommonSelect(),
      where: {
        id: +youtubeId,
      },
    });

    if (!video) {
      throw new NotFoundException();
    }

    return this.getYoutube(new VideoCommonReturn(video as VideoCommonDbReturn));
  }

  async updateYoutubeValidation(id: number, status: ValidationStatus) {
    const video = await this.prismaBase.video.update({
      data: {
        validationStatus: status,
      },
      where: {
        id: +id,
      },
    });

    return video;
  }

  async createYoutube(
    user: UserRequestModel,
    video: Express.Multer.File,
    itemId: number,
  ): Promise<Video> {
    const item = await this.prismaBase.item.findUnique({
      where: {
        id: +itemId,
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const provider = await this.prismaBase.hostingProvider.findUnique({
      where: {
        name: 'NoLoSay',
      },
    });
    if (!provider) {
      throw new InternalServerErrorException('No available provider');
    }

    if (user.activeProfile.role !== Role.CREATOR) {
      if (
        !(await this.profileService.canUserUseThisProfileRole(
          user.id,
          Role.CREATOR,
        ))
      )
        await this.profileService.createProfile(user.id, Role.CREATOR);
      // await this.profileService.changeActiveProfileWithRole(user, Role.CREATOR);
    }

    let autoValidation = false;
    if (user.activeProfile.role === Role.MANAGER) {
      if (item.siteId != null) {
        const site = await this.prismaBase.site.findUnique({
          where: {
            id: +item.siteId,
          },
          include: {
            siteHasManagers: true,
          },
        });
        if (site != null) {
          if (
            site.siteHasManagers.some(
              (manager) => manager.profileId === user.activeProfile.id,
            )
          ) {
            autoValidation = true;
          }
        }
      }
    }

    return await this.prismaBase.video.create({
      data: {
        hostingProvider: {
          connect: {
            id: +provider.id,
          },
        },
        hostingProviderVideoId: video.filename,
        postedBy: {
          connect: {
            userId_role: {
              role: Role.CREATOR,
              userId: +user.id,
            },
          },
        },
        uuid: video.filename.split('.')[0],
        item: {
          connect: {
            id: +itemId,
          },
        },
        validationStatus: autoValidation
          ? ValidationStatus.VALIDATED
          : ValidationStatus.PENDING,
      },
    });
  }

  // async createYoutube (
  //   user: UserRequestModel,
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
  //       externalProviderId: res?.data?.id || ''
  //     },
  //    connect: {
  //       postedBy: {
  //         userId: +user.id
  //      },
  //      item: {
  //        id: +itemId
  //      }
  //   })

  //   return noloVideo.uuid
  // }

  async getVideosFromItem(
    itemId: number,
    user: UserRequestModel,
  ): Promise<
    | VideoCommonReturn[]
    //| VideoManagerReturn[]
    | VideoModeratorReturn[]
    | VideoAdminReturn[]
  > {
    let selectOptions: Prisma.VideoSelect;

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new VideoAdminSelect(
          new VideoListedFromItemCommonSelect(),
        );
        break;
      case Role.MODERATOR:
        selectOptions = new VideoModeratorSelect(
          new VideoListedFromItemCommonSelect(),
        );
        break;
      // case Role.MANAGER:
      //   if (this.sitesManagersService)
      //   selectOptions = new VideoManagerSelect()
      //   break
      default:
        selectOptions = new VideoListedFromItemCommonSelect();
    }

    const videoEntities: unknown[] = await this.prismaBase.video.findMany({
      where: {
        itemId: +itemId,
        validationStatus: {
          in: getValidationStatusFromRole(user.activeProfile.role),
        },
      },
      select: selectOptions,
      orderBy: {
        likedBy: {
          _count: 'desc',
        },
      },
    });

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return videoEntities.map(
          (entity) => new VideoAdminReturn(entity as VideoAdminDbReturn),
        );
      case Role.MODERATOR:
        return videoEntities.map(
          (entity) =>
            new VideoModeratorReturn(entity as VideoModeratorDbReturn),
        );
      // case Role.MANAGER:
      //   return videoEntities.map(entity => new VideoManagerReturn(entity as VideoManagerDbReturn))
      default:
        return videoEntities.map(
          (entity) => new VideoCommonReturn(entity as VideoCommonDbReturn),
        );
    }
  }

  async getVideosFromUser(
    userId: number,
    user: UserRequestModel,
  ): Promise<
    | VideoCommonReturn[]
    | VideoCreatorReturn[]
    | VideoModeratorReturn[]
    | VideoAdminReturn[]
  > {
    let selectOptions: Prisma.VideoSelect;

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new VideoAdminSelect(
          new VideoListedFromUserCommonSelect(),
        );
        break;
      case Role.MODERATOR:
        selectOptions = new VideoModeratorSelect(
          new VideoListedFromUserCommonSelect(),
        );
        break;
      case Role.CREATOR:
        if (user.id === userId)
          selectOptions = new VideoCreatorSelect(
            new VideoListedFromUserCommonSelect(),
          );
        else selectOptions = new VideoListedFromUserCommonSelect();
        break;
      default:
        selectOptions = new VideoListedFromUserCommonSelect();
    }

    const videoEntities: unknown[] = await this.prismaBase.video.findMany({
      where: {
        postedBy: {
          role: Role.CREATOR,
          userId: +userId,
        },
        validationStatus: {
          in: getValidationStatusFromRole(
            user.activeProfile.role === Role.CREATOR && user.id === userId
              ? Role.MANAGER
              : user.activeProfile.role,
          ),
        },
      },
      select: selectOptions,
    });

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return videoEntities.map(
          (entity) => new VideoAdminReturn(entity as VideoAdminDbReturn),
        );
      case Role.MODERATOR:
        return videoEntities.map(
          (entity) =>
            new VideoModeratorReturn(entity as VideoModeratorDbReturn),
        );
      case Role.CREATOR:
        if (user.id === userId)
          return videoEntities.map(
            (entity) => new VideoCreatorReturn(entity as VideoCreatorDbReturn),
          );
        else
          return videoEntities.map(
            (entity) => new VideoCommonReturn(entity as VideoCommonDbReturn),
          );
      default:
        return videoEntities.map(
          (entity) => new VideoCommonReturn(entity as VideoCommonDbReturn),
        );
    }
  }

  async countVideos(
    validationStatus?: ValidationStatus | undefined,
    itemId?: number | undefined,
    userId?: number | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined,
  ): Promise<number> {
    return await this.prismaBase.video.count({
      where: {
        validationStatus: validationStatus ? validationStatus : undefined,
        itemId: itemId ? +itemId : undefined,
        postedBy: userId
          ? {
              role: Role.CREATOR,
              userId: +userId,
            }
          : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },
      },
    });
  }

  async getAllVideos(
    user: UserRequestModel,
    filters: FiltersGetMany,
    validationStatus?: ValidationStatus | undefined,
    itemId?: number | undefined,
    userId?: number | undefined,
    createdAtGte?: string | undefined,
    createdAtLte?: string | undefined,
  ): Promise<
    VideoCommonReturn[] | VideoModeratorReturn[] | VideoAdminReturn[]
  > {
    let selectOptions: Prisma.VideoSelect;

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        selectOptions = new VideoAdminSelect(new VideoCommonSelect());
        break;
      case Role.MODERATOR:
        selectOptions = new VideoModeratorSelect(new VideoCommonSelect());
        break;
      default:
        selectOptions = new VideoCommonSelect();
    }

    const videoEntities: unknown[] = await this.prismaBase.video.findMany({
      skip: +filters.start,
      take: +filters.end - filters.start,
      select: selectOptions,
      where: {
        validationStatus: validationStatus ? validationStatus : undefined,
        itemId: itemId ? +itemId : undefined,
        postedBy: userId
          ? {
              role: Role.CREATOR,
              userId: +userId,
            }
          : undefined,
        createdAt: {
          gte: createdAtGte ? new Date(createdAtGte) : undefined,
          lte: createdAtLte ? new Date(createdAtLte) : undefined,
        },
      },
      orderBy: {
        [filters.sort]: filters.order,
      },
    });

    switch (user.activeProfile.role) {
      case Role.ADMIN:
        return videoEntities.map(
          (entity) => new VideoAdminReturn(entity as VideoAdminDbReturn),
        );
      case Role.MODERATOR:
        return videoEntities.map(
          (entity) =>
            new VideoModeratorReturn(entity as VideoModeratorDbReturn),
        );
      default:
        return videoEntities.map(
          (entity) => new VideoCommonReturn(entity as VideoCommonDbReturn),
        );
    }
  }

  async deleteVideo(id: number, deleteReason: string) {
    return await this.prismaBase.video.update({
      data: {
        deletedAt: new Date(Date.now()),
        deletedReason: deleteReason,
      },
      where: {
        id: +id,
      },
    });
  }
}
