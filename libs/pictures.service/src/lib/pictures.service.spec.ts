import { Test, TestingModule } from '@nestjs/testing';
import { PicturesService } from './pictures.service';
import { RootTestModule } from '@noloback/root.test';

describe('PicturesService', () => {
  let service: PicturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PicturesService],
      imports: [RootTestModule],
    }).compile();

    service = module.get<PicturesService>(PicturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
