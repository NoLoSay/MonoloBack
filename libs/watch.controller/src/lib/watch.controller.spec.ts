import { Test, TestingModule } from '@nestjs/testing';
import { WatchController } from './watch.controller';
import { VideoService } from '@noloback/video.service';

describe('WatchController', () => {
  let controller: WatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchController],
      providers: [VideoService],
    }).compile();

    controller = module.get<WatchController>(WatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
