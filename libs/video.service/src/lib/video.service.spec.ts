import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';

describe('VideoService', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [VideoService],
      imports: [ HttpModule ]
    }).compile();
  });

  describe('getVideo', () => {
    it('should return 1234', async () => {
      const service = app.get(VideoService);
      expect(await service.getVideo('1234')).toBe('1234');
    });
  })
});
