import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RootTestModule } from '@noloback/root.test';

describe('RegisterController', () => {
  let controller: RegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      imports: [RootTestModule],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
