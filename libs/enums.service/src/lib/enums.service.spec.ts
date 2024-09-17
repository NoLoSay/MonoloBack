import { Test, TestingModule } from '@nestjs/testing';
import { EnumsService } from './enums.service';
import { RootTestModule } from '@noloback/root.test';

describe('EnumsService', () => {
  let service: EnumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnumsService],
      imports: [RootTestModule],
    }).compile();

    service = module.get<EnumsService>(EnumsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
