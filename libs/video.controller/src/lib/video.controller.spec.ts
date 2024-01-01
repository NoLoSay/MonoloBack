import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { HttpModule } from '@nestjs/axios';
import { VideoService } from '@noloback/video.service';
import { MulterModule } from '@nestjs/platform-express';

describe('VideoController', () => {
  let video: TestingModule;

  beforeAll(async () => {
    video = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [VideoService],
      imports: [HttpModule,
        MulterModule.registerAsync({
          useFactory: () => ({
            dest: './upload',
          })})
        ],
    }).compile();
  });

  it('should be truthy', () => {
    const controller = video.get<VideoController>(VideoController);
    expect(controller).toBeTruthy();
  });
});
