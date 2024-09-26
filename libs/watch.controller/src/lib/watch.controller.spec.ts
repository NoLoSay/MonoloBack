import { Test, TestingModule } from '@nestjs/testing';
import { WatchController } from './watch.controller';
import { VideoService } from '@noloback/video.service';
import { RootTestModule } from '@noloback/root.test';

describe('WatchController', () => {
  let controller: WatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchController],
      imports: [RootTestModule],
      providers: [VideoService]
    }).compile();

    controller = module.get<WatchController>(WatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
