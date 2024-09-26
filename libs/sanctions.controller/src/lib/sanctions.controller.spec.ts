import { Test, TestingModule } from '@nestjs/testing';
import { SanctionsController } from './sanctions.controller';
import { EnumsService } from '@noloback/enums.service';
import { RootTestModule } from '@noloback/root.test';

describe('SanctionsController', () => {
  let controller: SanctionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ 
      controllers: [SanctionsController],
      providers: [EnumsService],
      imports: [RootTestModule],
    }).compile();

    controller = module.get<SanctionsController>(SanctionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
