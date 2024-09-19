import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilsService],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse english custom dates', () => {
    expect(service.parseCustomDate('01 jan 2020')).toBe('2020:01:01');
    expect(service.parseCustomDate('01 january 2020')).toBe('2020:01:01');
    expect(service.parseCustomDate('10 feb 2020')).toBe('2020:02:10');
  });

  it('should parse french custom dates', () => {
    expect(service.parseCustomDate('01 janv 2020')).toBe('2020:01:01');
  });

  it('should parse universal custom dates', () => {
    expect(service.parseCustomDate('1 1 2020')).toBe('2020:01:01');
    expect(service.parseCustomDate('01/01/2020')).toBe('2020:01:01');
  });

  it('should parse flexible custom dates', () => {
    expect(service.parseCustomDate('2020')).toBe('2020:01:01');
    expect(service.parseCustomDate('janvier 2020')).toBe('2020:01:01');
  });

  it('should support impossible dates with classic JS dates', () => {
    expect(service.parseCustomDate('-2500')).toBe('-2500:01:01');
    expect(service.parseCustomDate('1 feb 202020')).toBe('202020:02:01');
  });

  it('should catch exceptions', () => {
    expect(() => service.parseCustomDate(undefined!)).toThrow();
  });
});
