import { Test, TestingModule } from '@nestjs/testing';
import { CrashController } from './crash.controller';
import { RootTestModule } from '@noloback/root.test';

describe('CrashController', () => {
  let controller: CrashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrashController],
      imports: [RootTestModule],
    }).compile();

    controller = module.get<CrashController>(CrashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
