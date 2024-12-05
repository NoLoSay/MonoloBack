import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getValidationStatusFromRole, VideoService } from './video.service';
import {
  PrismaBaseService,
  Role,
  Site,
  Video,
} from '@noloback/prisma-client-base';
import { VideoCommonReturn } from '@noloback/api.returns';
import { VideoCommonDbReturn } from '@noloback/db.returns';
import { LoggerService } from '@noloback/logger-lib';
import { ProfileService } from '@noloback/profile.service';
import { SitesManagersService } from '@noloback/sites.managers.service';
import { UserRequestModel } from '@noloback/requests.constructor';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import exp = require('constants');

class Provider {
  constructor(url: string) {
    this.url = url;
  }

  url: string;
}

class HostingProvider {
  async findUnique(): Promise<Provider> {
    return new Provider('aaa');
  }
}

class MockPrisma {
  constructor() {
    this.hostingProvider = new HostingProvider();
  }

  hostingProvider: HostingProvider;
}

class EmptyService {}

describe('videoservice', () => {
  let app: TestingModule;
  let prismaBase: PrismaBaseService;
  let sitesManagersService: SitesManagersService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: PrismaBaseService,
          useValue: {
            video: {
              count: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            hostingProvider: {
              findUnique: jest.fn(),
            },
            site: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: LoggerService,
          useClass: EmptyService,
        },
        {
          provide: ProfileService,
          useClass: EmptyService,
        },
        {
          provide: SitesManagersService,
          useValue: {
            isAllowedToModify: jest.fn(),
          },
        },
      ],
      imports: [HttpModule],
    }).compile();

    prismaBase = app.get<PrismaBaseService>(PrismaBaseService);
    sitesManagersService = app.get<SitesManagersService>(SitesManagersService);
  });

  describe('getYoutube', () => {
    it('should return the mocked video', async () => {
      const service = app.get(VideoService);
      const video: VideoCommonReturn = new VideoCommonReturn(
        new VideoCommonDbReturn(),
      );
      const findUniqueSpy = jest
        .spyOn(prismaBase.hostingProvider, 'findUnique')
        .mockResolvedValue({
          url: 'aaa',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          id: 1,
          name: 'aaa',
        });
      expect((await service.getYoutube(video)).url).toStrictEqual('aaa');
      expect(findUniqueSpy).toHaveBeenCalled();
    });
  });

  describe('getValidationStatusFromRole', () => {
    it('should return the validation status', async () => {
      expect(await getValidationStatusFromRole(Role.ADMIN)).toStrictEqual([
        'VALIDATED',
        'PENDING',
        'REFUSED',
      ]);
      expect(await getValidationStatusFromRole(Role.MODERATOR)).toStrictEqual([
        'VALIDATED',
        'PENDING',
        'REFUSED',
      ]);
      expect(await getValidationStatusFromRole(Role.MANAGER)).toStrictEqual([
        'VALIDATED',
        'PENDING',
      ]);
      expect(await getValidationStatusFromRole(Role.USER)).toStrictEqual([
        'VALIDATED',
      ]);
    });
  });

  describe('updateVideoShowcased', () => {
    it('should throw if the video is not found', async () => {
      const service = app.get(VideoService);
      const video: VideoCommonReturn = new VideoCommonReturn(
        new VideoCommonDbReturn(),
      );
      const user: UserRequestModel = {
        id: 1234,
        username: 'test',
        email: 'test',
        picture: 'test',
        telNumber: 'test',
        createdAt: new Date(),
        activeProfile: { id: 1234, role: Role.MANAGER },
        emailVerified: true,
        password: 'test',
      };
      const findFirstSpy = jest
        .spyOn(prismaBase.video, 'findFirst')
        .mockResolvedValue(null);
      expect(service.updateVideoShowcased(user, 1234, true)).rejects.toThrow(
        NotFoundException,
      );
      expect(findFirstSpy).toHaveBeenCalled();
    });

    it('should throw if the site is invalid', async () => {
      const service = app.get(VideoService);
      const user: UserRequestModel = {
        id: 1234,
        username: 'test',
        email: 'test',
        picture: 'test',
        telNumber: 'test',
        createdAt: new Date(),
        activeProfile: { id: 1234, role: Role.MANAGER },
        emailVerified: true,
        password: 'test',
      };
      const video: Video = {
        id: 1234,
        showcased: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        uuid: '',
        hostingProviderId: 0,
        hostingProviderVideoId: '',
        validationStatus: 'VALIDATED',
        duration: 0,
        deletedReason: null,
        itemId: 0,
        profileId: 0,
        signLanguageId: null
      }
      const findFirstSpyVideo = jest
        .spyOn(prismaBase.video, 'findFirst')
        .mockResolvedValue(video);
      const findFirstSpySite = jest
        .spyOn(prismaBase.site, 'findFirst')
        .mockResolvedValue(null);
      expect(service.updateVideoShowcased(user, 1234, true)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw if the user is not allowed to modify the site', async () => {
      const service = app.get(VideoService);
      const user: UserRequestModel = {
        id: 1234,
        username: 'test',
        email: 'test',
        picture: 'test',
        telNumber: 'test',
        createdAt: new Date(),
        activeProfile: { id: 1234, role: Role.MANAGER },
        emailVerified: true,
        password: 'test',
      };
      const video: Video = {
        id: 1234,
        showcased: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        uuid: '',
        hostingProviderId: 0,
        hostingProviderVideoId: '',
        validationStatus: 'VALIDATED',
        duration: 0,
        deletedReason: null,
        itemId: 0,
        profileId: 0,
        signLanguageId: null
      }
      const site: Site = {
        id: 1234,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        name: 'test',
        uuid: '',
        shortDescription: null,
        longDescription: null,
        telNumber: null,
        email: null,
        website: null,
        price: 0,
        type: 'MUSEUM',
        tags: [],
        addressId: 0
      }
      const findFirstSpyVideo = jest
        .spyOn(prismaBase.video, 'findFirst')
        .mockResolvedValue(video);
      const findFirstSpySite = jest
        .spyOn(prismaBase.site, 'findFirst')
        .mockResolvedValue(site);
      const isAllowedToModifySpy = jest.spyOn(
        sitesManagersService,
        'isAllowedToModify',
      ).mockResolvedValue(false);
      expect(service.updateVideoShowcased(user, 1234, true)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should update the video', async () => {
      const service = app.get(VideoService);
      const user: UserRequestModel = {
        id: 1234,
        username: 'test',
        email: 'test',
        picture: 'test',
        telNumber: 'test',
        createdAt: new Date(),
        activeProfile: { id: 1234, role: Role.ADMIN },
        emailVerified: true,
        password: 'test',
      };
      const video: Video = {
        id: 0,
        uuid: '',
        hostingProviderId: 0,
        hostingProviderVideoId: '',
        validationStatus: 'VALIDATED',
        duration: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        deletedReason: null,
        itemId: 0,
        showcased: false,
        profileId: 0,
        signLanguageId: null
      }
      const updateSpyVideo = jest.spyOn(prismaBase.video, 'update').mockResolvedValue(video);
      expect(await service.updateVideoShowcased(user, 1234, true)).toStrictEqual(video);
      expect(updateSpyVideo).toHaveBeenCalled();
    });
  });
});
