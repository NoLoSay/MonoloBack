import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from '@noloback/video.service';

class MockVideoService {}

describe('VideoController', () => {
  let video: TestingModule;

  beforeAll(async () => {
    video = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useClass: MockVideoService,
        },
      ],
    }).compile();
  });

  it('should be truthy', () => {
    const controller = video.get<VideoController>(VideoController);
    expect(controller).toBeTruthy();
  });
});
