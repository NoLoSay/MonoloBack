import { ItemType, PrismaBaseService } from '@noloback/prisma-client-base';
import { ItemTypesService } from './item.types.service';
import { LoggerService } from '@noloback/logger-lib';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@noloback/prisma-client-base';
import { FiltersGetMany } from 'models/filters-get-many';
import { ItemTypeDetailledSelect } from '@noloback/db.calls';
import { ItemTypeDetailledReturn } from '@noloback/api.returns';
import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('ItemTypesService', () => {
  let service: ItemTypesService;
  let prismaBaseService: PrismaBaseService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemTypesService,
        {
          provide: PrismaBaseService,
          useValue: {
            itemType: {
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
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ItemTypesService>(ItemTypesService);
    prismaBaseService = module.get<PrismaBaseService>(PrismaBaseService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should return the count of item types', async () => {
      const role = Role.ADMIN;
      const itemCategoryId = 1;
      const nameStart = 'test';
      const createdAtGte = '2021-01-01';
      const createdAtLte = '2021-12-31';
      const count = 1;

      jest.spyOn(prismaBaseService.itemType, 'count').mockResolvedValue(count);

      expect(
        await service.count(
          role,
          itemCategoryId,
          nameStart,
          createdAtGte,
          createdAtLte,
        ),
      ).toBe(count);
      expect(
        await service.count(
          Role.USER,
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      ).toBe(count);
    });
  });

  describe('findAll', () => {
    it('should return the item types', async () => {
      const role = Role.ADMIN;
      const filters: FiltersGetMany = {
        start: 0,
        end: 10,
        sort: 'id',
        order: 'asc',
      };
      const itemCategoryId = 1;
      const nameStart = 'test';
      const createdAtGte = '2021-01-01';
      const createdAtLte = '2021-12-31';
      const types: ItemType[] = [
        {
          id: 1,
          name: 'test',
          description: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          itemCategoryId: 1,
        },
      ];

      jest
        .spyOn(prismaBaseService.itemType, 'findMany')
        .mockResolvedValue(types);

      expect(
        await service.findAll(
          role,
          filters,
          itemCategoryId,
          nameStart,
          createdAtGte,
          createdAtLte,
        ),
      ).toBe(types);
      expect(
        await service.findAll(
          Role.USER,
          filters,
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      ).toBe(types);
    });
  });

  describe('findOne', () => {
    const type: ItemType = {
      id: 1,
      name: 'test',
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      itemCategoryId: 1,
    };

    it('should return the item type for admins', async () => {
      jest
        .spyOn(prismaBaseService.itemType, 'findUnique')
        .mockResolvedValue(type);

      expect(await service.findOne(type.id, Role.ADMIN)).toBe(type);
    });

    it('should return the item type for users', async () => {
      jest
        .spyOn(prismaBaseService.itemType, 'findUnique')
        .mockResolvedValue(type);

      expect(await service.findOne(type.id, Role.USER)).toBe(type);
    });

    it('should throw an error if the item type does not exist', async () => {
      jest
        .spyOn(prismaBaseService.itemType, 'findUnique')
        .mockRejectedValue(new NotFoundException());
      await expect(service.findOne(type.id, Role.ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create an item type', async () => {
      const type: ItemType = {
        id: 1,
        name: 'test',
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemCategoryId: 1,
      };

      jest.spyOn(prismaBaseService.itemType, 'create').mockResolvedValue(type);

      expect(
        await service.create({
          name: type.name,
          description: type.description || '',
          itemCategoryId: 1,
        }),
      ).toBe(type);
    });

    it('should throw an error if the item type cannot be created', async () => {
      jest
        .spyOn(prismaBaseService.itemType, 'create')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(
        service.create({
          name: 'test',
          description: 'test',
          itemCategoryId: 1,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw an error if itemCategoryId is invalid', async () => {
      await expect(
        service.create({
          name: 'test',
          description: 'test',
          itemCategoryId: 0,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an item type', async () => {
      const type: ItemType = {
        id: 1,
        name: 'test',
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemCategoryId: 1,
      };

      jest.spyOn(prismaBaseService.itemType, 'update').mockResolvedValue(type);

      expect(
        await service.update(type.id, {
          name: type.name,
          description: type.description || '',
          itemCategoryId: 1,
        }),
      ).toBe(type);
    });

    it('should throw an error if the item type cannot be updated', async () => {
      jest
        .spyOn(prismaBaseService.itemType, 'update')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(
        service.update(1, {
          name: 'test',
          description: 'test',
          itemCategoryId: 1,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw an error if itemCategoryId is invalid', async () => {
      await expect(
        service.update(1, {
          name: 'test',
          description: 'test',
          itemCategoryId: 0,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete an item type', async () => {
      const type: ItemType = {
        id: 1,
        name: 'test',
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemCategoryId: 1,
      };

      jest.spyOn(prismaBaseService.itemType, 'update').mockResolvedValue(type);

      expect(await service.delete(type.id)).toBe(type);
    });

    it('should throw an error if the item type cannot be deleted', async () => {
      jest
        .spyOn(prismaBaseService.itemType, 'update')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(service.delete(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('patch', () => {
    it('should patch an item type', async () => {
      const type: ItemType = {
        id: 1,
        name: 'test',
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemCategoryId: 1,
      };

      jest.spyOn(prismaBaseService.itemType, 'update').mockResolvedValue(type);

      expect(
        await service.patch(type.id, {
          name: type.name,
          description: type.description || '',
          itemCategoryId: 1,
        }),
      ).toBe(type);
    });

    it('should throw an error if the item type cannot be patched', async () => {
      jest
        .spyOn(prismaBaseService.itemType, 'update')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(
        service.patch(1, {
          name: 'test',
          description: 'test',
          itemCategoryId: 1,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
