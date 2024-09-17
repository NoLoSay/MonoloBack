import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { RootTestModule } from '@noloback/root.test';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [RootTestModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
