import { Test, TestingModule } from '@nestjs/testing';
import { UploadthingService } from './uploadthing.service';
import { RootTestModule } from '@noloback/root.test';

describe('UploadthingService', () => {
  let service: UploadthingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadthingService],
      imports: [RootTestModule],
    }).compile();

    service = module.get<UploadthingService>(UploadthingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
