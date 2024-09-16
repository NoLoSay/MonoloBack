import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { PrismaBaseService } from '@noloback/prisma-client-base';
import { VideoCommonReturn } from '@noloback/api.returns';
import { VideoCommonDbReturn } from '@noloback/db.returns';
import { LoggerService } from '@noloback/logger-lib';
import { ProfileService } from '@noloback/profile.service';
import { SitesManagersService } from '@noloback/sites.managers.service';

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

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: PrismaBaseService,
          useClass: MockPrisma,
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
  });

  describe('getYoutube', () => {
    it('should return the mocked video', async () => {
      const service = app.get(VideoService);
      const video: VideoCommonReturn = new VideoCommonReturn(
        new VideoCommonDbReturn()
      );
      expect(await service.getYoutube(video)).toStrictEqual({
        video: video,
        url: 'aaa'
          .replace('${videoUUID}', video.uuid)
          .replace('${providerVideoId}', video.hostingProviderVideoId),
      });
    });
  });
});
