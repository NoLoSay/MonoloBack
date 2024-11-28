import {
  ItemCategory,
  PrismaBaseService,
  Role,
} from '@noloback/prisma-client-base';
import { ItemCategoriesService } from './item.categories.service';
import { LoggerService } from '@noloback/logger-lib';
import { Test, TestingModule } from '@nestjs/testing';
import { FiltersGetMany } from 'models/filters-get-many';
import { ItemCategoryDetailledSelect } from '@noloback/db.calls';
import { ItemCategoryDetailledReturn } from '@noloback/api.returns';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ItemCategoriesService', () => {
  let service: ItemCategoriesService;
  let prismaBaseService: PrismaBaseService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemCategoriesService,
        {
          provide: PrismaBaseService,
          useValue: {
            itemCategory: {
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

    service = module.get<ItemCategoriesService>(ItemCategoriesService);
    prismaBaseService = module.get<PrismaBaseService>(PrismaBaseService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should return the count of item categories', async () => {
      const role = Role.ADMIN;
      const nameStart = 'test';
      const createdAtGte = '2021-01-01';
      const createdAtLte = '2021-12-31';
      const count = 1;

      jest
        .spyOn(prismaBaseService.itemCategory, 'count')
        .mockResolvedValue(count);

      expect(
        await service.count(role, nameStart, createdAtGte, createdAtLte),
      ).toBe(count);
      expect(
        await service.count(Role.USER, undefined, undefined, undefined),
      ).toBe(count);
    });
  });

  describe('findAll', () => {
    it('should return the item categories', async () => {
      const role = Role.ADMIN;
      const filters: FiltersGetMany = {
        start: 0,
        end: 10,
        sort: 'id',
        order: 'asc',
      };
      const nameStart = 'test';
      const createdAtGte = '2021-01-01';
      const createdAtLte = '2021-12-31';
      const categories: ItemCategory[] = [
        {
          id: 1,
          name: 'test',
          description: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest
        .spyOn(prismaBaseService.itemCategory, 'findMany')
        .mockResolvedValue(categories);

      expect(
        await service.findAll(
          role,
          filters,
          nameStart,
          createdAtGte,
          createdAtLte,
        ),
      ).toBe(categories);
      expect(
        await service.findAll(
          Role.USER,
          filters,
          undefined,
          undefined,
          undefined,
        ),
      ).toBe(categories);
    });
  });

  describe('findOne', () => {
    const category: ItemCategory = {
      id: 1,
      name: 'test',
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should return the item category for admins', async () => {
      jest
        .spyOn(prismaBaseService.itemCategory, 'findUnique')
        .mockResolvedValue(category);

      expect(await service.findOne(category.id, Role.ADMIN)).toBe(category);
    });

    it('should return the item category for users', async () => {
      jest
        .spyOn(prismaBaseService.itemCategory, 'findUnique')
        .mockResolvedValue(category);

      expect(await service.findOne(category.id, Role.USER)).toBe(category);
    });

    it('should throw an error if the item category does not exist', async () => {
      jest
        .spyOn(prismaBaseService.itemCategory, 'findUnique')
        .mockRejectedValue(new NotFoundException());
      await expect(service.findOne(category.id, Role.ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create an item category', async () => {
      const category: ItemCategory = {
        id: 1,
        name: 'test',
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(prismaBaseService.itemCategory, 'create')
        .mockResolvedValue(category);

      expect(
        await service.create({
          name: category.name,
          description: category.description || '',
        }),
      ).toBe(category);
    });

    it('should throw an error if the item category cannot be created', async () => {
      jest
        .spyOn(prismaBaseService.itemCategory, 'create')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(
        service.create({
          name: 'test',
          description: 'test',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update an item category', async () => {
      const category: ItemCategory = {
        id: 1,
        name: 'test',
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(prismaBaseService.itemCategory, 'update')
        .mockResolvedValue(category);

      expect(
        await service.update(category.id, {
          name: category.name,
          description: category.description || '',
        }),
      ).toBe(category);
    });

    it('should throw an error if the item category cannot be updated', async () => {
      jest
        .spyOn(prismaBaseService.itemCategory, 'update')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(
        service.update(1, {
          name: 'test',
          description: 'test',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    it('should delete an item category', async () => {
      const category: ItemCategory = {
        id: 1,
        name: 'test',
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(prismaBaseService.itemCategory, 'update')
        .mockResolvedValue(category);

      expect(await service.delete(category.id)).toBe(category);
    });

    it('should throw an error if the item category cannot be deleted', async () => {
      jest
        .spyOn(prismaBaseService.itemCategory, 'update')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(service.delete(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('patch', () => {
    it('should patch an item category', async () => {
      const category: ItemCategory = {
        id: 1,
        name: 'test',
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(prismaBaseService.itemCategory, 'update')
        .mockResolvedValue(category);

      expect(
        await service.patch(category.id, {
          name: category.name,
          description: category.description || '',
        }),
      ).toBe(category);
    });

    it('should throw an error if the item category cannot be patched', async () => {
      jest
        .spyOn(prismaBaseService.itemCategory, 'update')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(
        service.patch(1, {
          name: 'test',
          description: 'test',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
