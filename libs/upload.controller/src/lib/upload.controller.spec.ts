import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { VideoService } from '@noloback/video.service';
import { RootTestModule } from '@noloback/root.test';

describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      imports: [RootTestModule],
      providers: [VideoService],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
