import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { Item, PrismaBaseService } from '@noloback/prisma-client-base';
import { SitesManagersService } from '@noloback/sites.managers.service';
import { PicturesService } from '@noloback/pictures.service';
import { VideoService } from '@noloback/video.service';
import { LoggerService } from '@noloback/logger-lib';
import { UploadthingService } from '@noloback/uploadthing.service';
import {
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FiltersGetMany } from 'models/filters-get-many';
import { ItemManipulationModel } from '@noloback/api.request.bodies';
import { UserRequestModel } from '@noloback/requests.constructor';
import { Role } from '@noloback/prisma-client-base';

describe('ItemsService', () => {
  let service: ItemsService;
  let prismaBaseService: PrismaBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaBaseService,
          useValue: {
            item: {
              findUnique: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
            },
            site: {
              count: jest.fn(),
            },
          },
        },
        {
          provide: SitesManagersService,
          useValue: {
            isAllowedToModify: jest.fn(),
            isMainManagerOfSite: jest.fn(),
          },
        },
        {
          provide: PicturesService,
          useValue: {
            createPicture: jest.fn(),
          },
        },
        {
          provide: VideoService,
          useValue: {},
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: UploadthingService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    prismaBaseService = module.get<PrismaBaseService>(PrismaBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkExistingItem', () => {
    it('should throw NotFoundException if item does not exist', async () => {
      jest.spyOn(prismaBaseService.item, 'findUnique').mockResolvedValue(null);
      await expect(service.checkExistingItem(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the item if it exists', async () => {
      const item = {
        id: 1,
        uuid: 'uuid',
        name: 'name',
        description: 'description',
        textToTranslate: 'textToTranslate',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemTypeId: 1,
        relatedPersonId: 1,
        siteId: 1,
      };
      jest.spyOn(prismaBaseService.item, 'findUnique').mockResolvedValue(item);
      expect(await service.checkExistingItem(1)).toEqual(item);
    });
  });

  describe('checkExistingSite', () => {
    it('should throw NotFoundException if site does not exist', async () => {
      jest.spyOn(prismaBaseService.site, 'count').mockResolvedValue(0);
      await expect(service.checkExistingSite(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not throw if site exists', async () => {
      jest.spyOn(prismaBaseService.site, 'count').mockResolvedValue(1);
      await expect(service.checkExistingSite(1)).resolves.not.toThrow();
    });
  });

  describe('patch', () => {
    it('should update item with new picture', async () => {
      const body: ItemManipulationModel = {
        siteId: 1,
        name: 'name',
        textToTranslate: 'text',
      };
      const picture = { path: 'path/to/picture' } as Express.Multer.File;
      jest.spyOn(service, 'checkExistingSite').mockResolvedValue(undefined);
      jest
        .spyOn(service['uploadthingService'], 'uploadFile')
        .mockResolvedValue('uploaded/path');
      jest.spyOn(prismaBaseService.item, 'update').mockResolvedValue({} as any);

      await service.patch(1, body, picture);

      expect(service['uploadthingService'].uploadFile).toHaveBeenCalledWith(
        picture,
      );
      expect(prismaBaseService.item.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...body, picture: 'uploaded/path' },
        select: expect.any(Object),
      });
    });
  });

  describe('count', () => {
    it('should return the count of items', async () => {
      jest.spyOn(prismaBaseService.item, 'count').mockResolvedValue(10);
      const filters: FiltersGetMany = {
        start: 0,
        end: 10,
        sort: 'name',
        order: 'asc',
      };
      expect(await service.count(Role.ADMIN, filters)).toBe(10);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(prismaBaseService.item, 'count')
        .mockRejectedValue(new InternalServerErrorException('error'));
      const filters: FiltersGetMany = {
        start: 0,
        end: 10,
        sort: 'name',
        order: 'asc',
      };
      await expect(service.count(Role.ADMIN, filters)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return items based on role', async () => {
      const items = [
        {
          id: 1,
          uuid: 'uuid',
          name: 'item1',
          description: 'description',
          textToTranslate: 'textToTranslate',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          itemTypeId: 1,
          relatedPersonId: 1,
          siteId: 1,
        },
      ];
      jest.spyOn(prismaBaseService.item, 'findMany').mockResolvedValue(items);
      const filters: FiltersGetMany = {
        start: 0,
        end: 10,
        sort: 'name',
        order: 'asc',
      };
      expect(await service.findAll(Role.USER, filters)).toEqual(items);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(prismaBaseService.item, 'findMany')
        .mockRejectedValue(new InternalServerErrorException('error'));
      const filters: FiltersGetMany = {
        start: 0,
        end: 10,
        sort: 'name',
        order: 'asc',
      };
      await expect(service.findAll(Role.ADMIN, filters)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOneDetailled', () => {
    it('should return detailed item based on user role', async () => {
      const item = {
        id: 1,
        uuid: 'uuid',
        name: 'item1',
        description: 'description',
        textToTranslate: 'textToTranslate',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemTypeId: 1,
        relatedPersonId: 1,
        siteId: 1,
      };
      jest.spyOn(prismaBaseService.item, 'findUnique').mockResolvedValue(item);
      const user: UserRequestModel = {
        id: 1,
        username: 'admin',
        password: 'password',
        email: 'admin@example.com',
        emailVerified: true,
        picture: 'path/to/picture',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.ADMIN,
          id: 0,
        },
      };
      expect(await service.findOneDetailled(1, user)).toEqual(item);
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(prismaBaseService.item, 'findUnique').mockResolvedValue(null);
      const user: UserRequestModel = {
        id: 1,
        username: 'admin',
        password: 'password',
        email: 'admin@example.com',
        emailVerified: true,
        picture: 'path/to/picture',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.ADMIN,
          id: 0,
        },
      };
      await expect(service.findOneDetailled(1, user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(prismaBaseService.item, 'findUnique')
        .mockRejectedValue(new InternalServerErrorException('error'));
      const user: UserRequestModel = {
        id: 1,
        username: 'admin',
        password: 'password',
        email: 'admin@example.com',
        emailVerified: true,
        picture: 'path/to/picture',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.ADMIN,
          id: 0,
        },
      };
      await expect(service.findOneDetailled(1, user)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const item: ItemManipulationModel = {
        name: 'item1',
        description: 'desc',
        siteId: 1,
        textToTranslate: '',
      };
      const newItem: Item = {
        id: 1,
        uuid: 'uuid',
        name: item.name,
        description: item.description || null,
        textToTranslate: item.textToTranslate,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemTypeId: item.itemTypeId || null,
        relatedPersonId: item.relatedPersonId || null,
        siteId: item.siteId,
      };
      jest.spyOn(prismaBaseService.item, 'create').mockResolvedValue(newItem);
      expect(await service.create(item)).toEqual(newItem);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(prismaBaseService.item, 'create')
        .mockRejectedValue(new InternalServerErrorException('error'));
      const item: ItemManipulationModel = {
        name: 'item1',
        description: 'desc',
        siteId: 1,
        textToTranslate: '',
      };
      await expect(service.create(item)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing item', async () => {
      const item: ItemManipulationModel = {
        name: 'item1',
        description: 'desc',
        siteId: 1,
        textToTranslate: '',
      };
      const existingItem = {
        id: 1,
        uuid: 'uuid',
        name: 'item1',
        description: 'desc',
        textToTranslate: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemTypeId: null,
        relatedPersonId: null,
        siteId: 1,
      };
      const updatedItem = {
        ...existingItem,
        name: item.name,
        description: item.description || null,
        textToTranslate: item.textToTranslate,
      };
      jest
        .spyOn(service, 'checkExistingItem')
        .mockResolvedValue(existingItem as any);
      jest
        .spyOn(service['sitesManagersService'], 'isAllowedToModify')
        .mockResolvedValue(true);
      jest
        .spyOn(prismaBaseService.item, 'update')
        .mockResolvedValue(updatedItem);
      const user: UserRequestModel = {
        id: 1,
        username: 'admin',
        password: 'password',
        email: 'admin@example.com',
        emailVerified: true,
        picture: 'path/to/file',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.ADMIN,
          id: 0,
        },
      };
      const file = { path: 'path/to/file' } as Express.Multer.File;
      expect(await service.update(1, item, user, file)).toEqual(updatedItem);
    });

    it('should throw ForbiddenException if user is not allowed to modify', async () => {
      const item: ItemManipulationModel = {
        name: 'item1',
        description: 'desc',
        siteId: 1,
        textToTranslate: '',
      };
      jest.spyOn(service, 'checkExistingItem').mockResolvedValue(item as any);
      jest
        .spyOn(service['sitesManagersService'], 'isAllowedToModify')
        .mockResolvedValue(false);
      const user: UserRequestModel = {
        id: 1,
        username: 'admin',
        password: 'password',
        email: 'admin@example.com',
        emailVerified: true,
        picture: 'path/to/picture',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.USER,
          id: 0,
        },
      };
      const file = { path: 'path/to/file' } as Express.Multer.File;
      await expect(service.update(1, item, user, file)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(service, 'checkExistingItem')
        .mockResolvedValue({ id: 1 } as any);
      jest
        .spyOn(prismaBaseService.item, 'update')
        .mockRejectedValue(new InternalServerErrorException('error'));
      const item: ItemManipulationModel = {
        name: 'item1',
        description: 'desc',
        siteId: 1,
        textToTranslate: '',
      };
      const user: UserRequestModel = {
        id: 1,
        username: 'admin',
        password: 'password',
        email: 'admin@example.com',
        emailVerified: true,
        picture: 'path/to/picture',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.ADMIN,
          id: 0,
        },
      };
      const file = { path: 'path/to/file' } as Express.Multer.File;
      await expect(service.update(1, item, user, file)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an item', async () => {
      const item = {
        id: 1,
        uuid: 'uuid',
        name: 'item1',
        description: 'desc',
        textToTranslate: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemTypeId: null,
        relatedPersonId: null,
        siteId: 1,
      };
      jest.spyOn(service, 'checkExistingItem').mockResolvedValue(item as any);
      jest.spyOn(prismaBaseService.item, 'update').mockResolvedValue(item);
      expect(await service.delete(1)).toEqual(item);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(service, 'checkExistingItem')
        .mockResolvedValue({ id: 1 } as any);
      jest
        .spyOn(prismaBaseService.item, 'update')
        .mockRejectedValue(new InternalServerErrorException('error'));
      await expect(service.delete(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAllVideoPendingItems', () => {
    it('should return all video pending items', async () => {
      const items = [
        {
          id: 1,
          uuid: 'uuid',
          name: 'item1',
          description: 'description',
          textToTranslate: 'textToTranslate',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          itemTypeId: 1,
          relatedPersonId: 1,
          siteId: 1,
        },
      ];
      jest.spyOn(prismaBaseService.item, 'findMany').mockResolvedValue(items);
      expect(await service.findAllVideoPendingItems()).toEqual(items);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(prismaBaseService.item, 'findMany')
        .mockRejectedValue(new InternalServerErrorException('error'));
      await expect(service.findAllVideoPendingItems()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('giveItemToSite', () => {
    it('should give item to site', async () => {
      const item = {
        id: 1,
        uuid: 'uuid',
        name: 'item1',
        description: 'desc',
        textToTranslate: 'textToTranslate',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        itemTypeId: 1,
        relatedPersonId: 1,
        siteId: 1,
      };
      jest.spyOn(service, 'checkExistingItem').mockResolvedValue(item as any);
      jest.spyOn(service, 'checkExistingSite').mockResolvedValue(undefined);
      jest.spyOn(prismaBaseService.item, 'update').mockResolvedValue(item);
      const user: UserRequestModel = {
        id: 1,
        username: 'admin',
        password: 'password',
        email: 'admin@example.com',
        emailVerified: true,
        picture: 'path/to/picture',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.ADMIN,
          id: 0,
        },
      };
      expect(await service.giveItemToSite(1, 2, user)).toEqual(item);
    });

    it('should throw ForbiddenException if user is not allowed to give item', async () => {
      const item = { id: 1, name: 'item1', description: 'desc', siteId: 1 };
      jest.spyOn(service, 'checkExistingItem').mockResolvedValue(item as any);
      jest.spyOn(service, 'checkExistingSite').mockResolvedValue(undefined);
      jest
        .spyOn(service['sitesManagersService'], 'isMainManagerOfSite')
        .mockResolvedValue(false);
      const user: UserRequestModel = {
        id: 1,
        username: 'admin',
        password: 'password',
        email: 'admin@example.com',
        emailVerified: true,
        picture: 'path/to/picture',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.USER,
          id: 0,
        },
      };
      await expect(service.giveItemToSite(1, 2, user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
