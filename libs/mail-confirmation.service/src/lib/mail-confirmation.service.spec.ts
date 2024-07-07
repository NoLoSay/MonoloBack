import { Test, TestingModule } from '@nestjs/testing';
import { MailConfirmationService } from './mail-confirmation.service';

describe('MailConfirmationService', () => {
  let service: MailConfirmationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailConfirmationService],
    }).compile();

    service = module.get<MailConfirmationService>(MailConfirmationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
