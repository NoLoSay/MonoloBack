import { Test, TestingModule } from '@nestjs/testing';
import { SignLanguagesController } from './sign.languages.controller';
import { RootTestModule } from '@noloback/root.test';
import { SignLanguagesService } from '@noloback/sign.languages.service';

describe('SignLanguagesController', () => {
  let controller: SignLanguagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignLanguagesController],
      providers: [SignLanguagesService],
      imports: [RootTestModule],
    }).compile();

    controller = module.get<SignLanguagesController>(SignLanguagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
