import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from '../../services/video.service';
import { HttpModule } from '@nestjs/axios';

describe('VideoController', () => {
  let video: TestingModule;

  beforeAll(async () => {
    video = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [VideoService],
      imports: [ HttpModule ],
    }).compile();
  });

  it('should be truthy', () => {
    const controller = video.get<VideoController>(VideoController);
    expect(controller).toBeTruthy();
  });
});
