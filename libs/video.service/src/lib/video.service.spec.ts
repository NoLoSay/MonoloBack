import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getValidationStatusFromRole, VideoService } from './video.service';
import { PrismaBaseService, Role, Video } from '@noloback/prisma-client-base';
import { VideoCommonReturn } from '@noloback/api.returns';
import { VideoCommonDbReturn } from '@noloback/db.returns';
import { LoggerService } from '@noloback/logger-lib';
import { ProfileService } from '@noloback/profile.service';
import { SitesManagersService } from '@noloback/sites.managers.service';
import { UserRequestModel } from '@noloback/requests.constructor';
import { NotFoundException } from '@nestjs/common';
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
          useClass: EmptyService,
        },
      ],
      imports: [HttpModule],
    }).compile();

    prismaBase = app.get<PrismaBaseService>(PrismaBaseService);
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
  });
});
