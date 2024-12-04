import { Test, TestingModule } from '@nestjs/testing';
import { SanctionsService } from './sanctions.service';
import {
  PrismaBaseService,
  Role,
  Sanctions,
} from '@noloback/prisma-client-base';
import { LoggerService } from '@noloback/logger-lib';
import { SanctionType } from '@noloback/prisma-client-base';
import { UserRequestModel } from '@noloback/requests.constructor';
import { FiltersGetMany } from 'models/filters-get-many';
import { cp } from 'fs';

describe('SanctionsService', () => {
  let service: SanctionsService;
  let prismaBaseService: PrismaBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SanctionsService,
        {
          provide: PrismaBaseService,
          useValue: {
            sanctions: {
              count: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: LoggerService,
          useValue: {
            sensitiveLog: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SanctionsService>(SanctionsService);
    prismaBaseService = module.get<PrismaBaseService>(PrismaBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should return the count of sanctions', async () => {
      const countSpy = jest
        .spyOn(prismaBaseService.sanctions, 'count')
        .mockResolvedValue(5);
      const result = await service.count();
      expect(result).toBe(5);
      expect(countSpy).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all sanctions', async () => {
      const sanctions = [
        {
          id: 1,
          userId: 1,
          sanctionType: SanctionType.BAN,
          reason: 'reason',
          issuerId: 1,
          sanctionStart: new Date(),
          sanctionEnd: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          userId: 2,
          sanctionType: SanctionType.BAN,
          reason: 'reason',
          issuerId: 1,
          sanctionStart: new Date(),
          sanctionEnd: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      const findManySpy = jest
        .spyOn(prismaBaseService.sanctions, 'findMany')
        .mockResolvedValue(sanctions);
      const filters: FiltersGetMany = {
        start: 0,
        end: 10,
        sort: 'id',
        order: 'asc',
      };
      const result = await service.findAll(filters);
      expect(result).toBe(sanctions);
      expect(findManySpy).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a sanction by id', async () => {
      const sanctions = [
        {
          id: 1,
          userId: 1,
          sanctionType: SanctionType.BAN,
          reason: 'reason1',
          issuerId: 1,
          sanctionStart: new Date(),
          sanctionEnd: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          userId: 2,
          sanctionType: SanctionType.BAN,
          reason: 'reason2',
          issuerId: 1,
          sanctionStart: new Date(),
          sanctionEnd: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      const findUniqueSpy = jest
        .spyOn(prismaBaseService.sanctions, 'findUnique')
        .mockResolvedValue(sanctions[1]);
      const result = await service.findById(1);
      expect(result?.reason).toBe('reason2');
      expect(findUniqueSpy).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new sanction', async () => {
      const sanction = {
        id: 1,
        userId: 2,
        sanctionType: SanctionType.BAN,
        reason: 'reason',
        issuerId: 1,
        sanctionStart: new Date(),
        sanctionEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const createSpy = jest
        .spyOn(prismaBaseService.sanctions, 'create')
        .mockResolvedValue(sanction);
      const user: UserRequestModel = {
        activeProfile: { id: 1, role: Role.ADMIN },
      } as UserRequestModel;
      const result = await service.create(user, 2, SanctionType.BAN, 'reason');
      expect(result).toBe(sanction);
      expect(createSpy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a sanction', async () => {
      const sanction: Sanctions = {
        id: 1,
        userId: 2,
        sanctionType: SanctionType.BAN,
        reason: 'reason',
        issuerId: 1,
        sanctionStart: new Date(),
        sanctionEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const updateSpy = jest
        .spyOn(prismaBaseService.sanctions, 'update')
        .mockResolvedValue(sanction);
      const user: UserRequestModel = {
        activeProfile: { id: 1 },
      } as UserRequestModel;
      const result = await service.update(
        user,
        1,
        2,
        SanctionType.BAN,
        'reason',
      );
      expect(result).toBe(sanction);
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('patch', () => {
    it('should patch a sanction', async () => {
      const sanction: Sanctions = {
        id: 1,
        userId: 2,
        sanctionType: SanctionType.BAN,
        reason: 'new reason',
        issuerId: 1,
        sanctionStart: new Date(),
        sanctionEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const findUniqueSpy = jest
        .spyOn(prismaBaseService.sanctions, 'findUnique')
        .mockResolvedValue(sanction);
      const updateSpy = jest
        .spyOn(prismaBaseService.sanctions, 'update')
        .mockResolvedValue(sanction);
      const user: UserRequestModel = {
        activeProfile: { id: 1 },
      } as UserRequestModel;
      const result = await service.patch(user, 1, { reason: 'new reason' });
      expect(result).toBe(sanction);
      expect(findUniqueSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a sanction', async () => {
      const sanction: Sanctions = {
        id: 1,
        userId: 2,
        sanctionType: SanctionType.BAN,
        reason: 'reason',
        issuerId: 1,
        sanctionStart: new Date(),
        sanctionEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      const updateSpy = jest
        .spyOn(prismaBaseService.sanctions, 'update')
        .mockResolvedValue(sanction);
      const user: UserRequestModel = {
        activeProfile: { id: 1 },
      } as UserRequestModel;
      const result = await service.delete(user, 1);
      expect(result).toBe(sanction);
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('getUserSanctionsById', () => {
    it('should return user sanctions by userId', async () => {
      const sanctions: Sanctions[] = [
        {
          id: 1,
          userId: 1,
          sanctionType: SanctionType.BAN,
          reason: 'reason',
          issuerId: 1,
          sanctionStart: new Date(),
          sanctionEnd: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      const findManySpy = jest
        .spyOn(prismaBaseService.sanctions, 'findMany')
        .mockResolvedValue(sanctions);
      const result = await service.getUserSanctionsById(1);
      expect(result.sanctions).toBe(sanctions);
      expect(findManySpy).toHaveBeenCalled();
    });

    it('should return empty sanctions if userId is not provided', async () => {
      const findManySpy = jest
        .spyOn(prismaBaseService.sanctions, 'findMany')
        .mockResolvedValue([]);
      const result = await service.getUserSanctionsById(0);
      expect(result.sanctions).toEqual([]);
      expect(findManySpy).not.toHaveBeenCalled();
    });
  });

  describe('getUserSanctionsByEmail', () => {
    it('should return user sanctions by email', async () => {
      const sanctions: Sanctions[] = [
        {
          id: 1,
          userId: 1,
          sanctionType: SanctionType.BAN,
          reason: 'reason',
          issuerId: 1,
          sanctionStart: new Date(),
          sanctionEnd: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      const findManySpy = jest
        .spyOn(prismaBaseService.sanctions, 'findMany')
        .mockResolvedValue(sanctions);
      const result = await service.getUserSanctionsByEmail('test@example.com');
      expect(result.sanctions).toBe(sanctions);
      expect(findManySpy).toHaveBeenCalled();
    });

    it('should return empty sanctions if email is not provided', async () => {
      const findManySpy = jest
        .spyOn(prismaBaseService.sanctions, 'findMany')
        .mockResolvedValue([]);
      const result = await service.getUserSanctionsByEmail('');
      expect(result.sanctions).toEqual([]);
      expect(findManySpy).not.toHaveBeenCalled();
    });
  });
});
