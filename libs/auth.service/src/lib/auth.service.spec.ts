import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RootTestModule } from '@noloback/root.test';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [RootTestModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
