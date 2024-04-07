import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { VideoService } from '@noloback/video.service';

describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [VideoService],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
