import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { RootTestModule } from '@noloback/root.test';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService],
      imports: [RootTestModule],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
