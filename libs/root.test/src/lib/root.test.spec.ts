import { Test, TestingModule } from '@nestjs/testing';

describe('RootTest', () => {
  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const module: TestingModule = await Test.createTestingModule({
    }).compile();
  });

  it('should be defined', () => {
    expect(this).toBeDefined();
  });
});
