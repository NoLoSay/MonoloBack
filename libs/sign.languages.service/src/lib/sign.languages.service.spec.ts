import { Test, TestingModule } from '@nestjs/testing';
import { SignLanguagesService } from './sign.languages.service';
import { RootTestModule } from '@noloback/root.test';

describe('SignLanguagesService', () => {
  let service: SignLanguagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignLanguagesService],
      imports: [RootTestModule],
    }).compile();

    service = module.get<SignLanguagesService>(SignLanguagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
