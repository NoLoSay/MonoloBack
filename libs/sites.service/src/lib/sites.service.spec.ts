import { Test, TestingModule } from '@nestjs/testing';
import { PrismaBaseService } from '@noloback/prisma-client-base';
import { LoggerService } from '@noloback/logger-lib';
import { SitesService } from './sites.service';
import { UserRequestModel } from '@noloback/requests.constructor';
import { FiltersGetMany } from 'models/filters-get-many';
import { SiteCommonReturn, SiteAdminReturn, SiteManagerReturn } from '@noloback/api.returns';
import { Role, SiteType, SiteTag } from '@noloback/prisma-client-base';
import { SitesManagersService } from '@noloback/sites.managers.service';
import { PicturesService } from '@noloback/pictures.service';

describe('SitesService', () => {
  let service: SitesService;
  let prismaBaseService: PrismaBaseService;
  let sitesManagerService: SitesManagersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitesService,
        {
          provide: PrismaBaseService,
          useValue: {
            site: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: LoggerService,
          useValue: {
            sensitiveLog: jest.fn(),
          },
        },
        {
          provide: PicturesService,
          useValue: {
            // Mock implementation of the PicturesService methods if needed
            findPictures: jest.fn(),
            createPicture: jest.fn(),
            
          },
        },
        SitesManagersService,
      ],
    }).compile();

    service = module.get<SitesService>(SitesService);
    prismaBaseService = module.get<PrismaBaseService>(PrismaBaseService);
    sitesManagerService = module.get<SitesManagersService>(SitesManagersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return SiteCommonReturn when user is not admin', async () => {
      const user: UserRequestModel = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        emailVerified: true,
        picture: '',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.USER,
          id: 0,
        },
        password: 'password',
      };

      const filters: FiltersGetMany = {
        start: 0,
        end: 10,
        sort: 'name',
        order: 'asc',
      };

      const mockSites: SiteCommonReturn[] = [
        {
          id: 1,
          uuid: '123',
          name: 'Site 1',
          shortDescription: 'Short description 1',
          longDescription: 'Long description 1',
          telNumber: '1234567890',
          email: 'site1@example.com',
          website: 'http://site1.com',
          price: 100,
          pictures: [],
          type: SiteTag.OTHER,
          tags: [SiteType.OTHER],
          address: {
            id: 1,
            houseNumber: '123',
            street: 'Main St',
            fullAddress: '123 Main St, Cityville, 12345',
            zip: '12345',
            city: {
              id: 1,
              name: 'Cityville',
              zip: '12345',
              department: { id: 1, name: 'DepartmentX', country: { id: 1, name: 'Countryland' } },
            },
            otherDetails: 'Near the central park',
            longitude: 123.456,
            latitude: 78.910,
          },
          exhibitions: [],
        },
      ];

      jest.spyOn(prismaBaseService.site, 'findMany').mockResolvedValue(mockSites as any);

      const result = await service.findAll(user, filters);

      expect(result).toEqual(mockSites);
      expect(prismaBaseService.site.findMany).toHaveBeenCalled();
    });

    it('should return SiteAdminReturn when user is admin', async () => {
      const user: UserRequestModel = {
        id: 1,
        username: 'admin1',
        email: 'admin1@example.com',
        emailVerified: true,
        picture: '',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.ADMIN,
          id: 0,
        },
        password: 'password',
      };

      const filters: FiltersGetMany = {
        start: 0,
        end: 10,
        sort: 'name',
        order: 'asc',
      };

      const mockSiteAdmin: SiteAdminReturn[] = [
        {
          id: 1,
          uuid: '123',
          name: 'Admin Site 1',
          shortDescription: 'Admin site short description',
          longDescription: 'Admin site long description',
          telNumber: '1234567890',
          email: 'adminsite1@example.com',
          website: 'http://adminsite1.com',
          price: 100,
          pictures: [],
          type: SiteTag.OTHER,
          tags: [SiteType.OTHER],
          address: {
            id: 1,
            houseNumber: '123',
            street: 'Main St',
            fullAddress: '123 Main St, AdminCity, 12345',
            zip: '12345',
            city: {
              id: 1,
              name: 'AdminCity',
              zip: '12345',
              department: { id: 1, name: 'AdminDepartment', country: { id: 1, name: 'AdminCountry' } },
            },
            otherDetails: 'Near the admin park',
            longitude: 123.456,
            latitude: 78.910,
          },
          exhibitions: [],
          siteHasManagers: [],
          updatedAt: new Date(),
          deletedAt: null,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prismaBaseService.site, 'findMany').mockResolvedValue(mockSiteAdmin as any);

      const result = await service.findAll(user, filters);

      expect(result).toEqual(mockSiteAdmin);
      expect(prismaBaseService.site.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return SiteAdminReturn for ADMIN role', async () => {
      const user: UserRequestModel = {
        id: 1,
        username: 'admin1',
        email: 'admin1@example.com',
        emailVerified: true,
        picture: '',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.ADMIN,
          id: 0,
        },
        password: 'password',
      };

      const mockSite: SiteAdminReturn = {
        id: 1,
        uuid: '123',
        name: 'Admin Site 1',
        shortDescription: 'Admin site short description',
        longDescription: 'Admin site long description',
        telNumber: '1234567890',
        email: 'adminsite1@example.com',
        website: 'http://adminsite1.com',
        price: 100,
        pictures: [],
        type: SiteTag.OTHER,
        tags: [SiteType.OTHER],
        address: {
          id: 1,
          houseNumber: '123',
          street: 'Main St',
          fullAddress: '123 Main St, AdminCity, 12345',
          zip: '12345',
          city: {
            id: 1,
            name: 'AdminCity',
            zip: '12345',
            department: { id: 1, name: 'AdminDepartment', country: { id: 1, name: 'AdminCountry' } },
          },
          otherDetails: 'Near the admin park',
          longitude: 123.456,
          latitude: 78.910,
        },
        exhibitions: [],
        siteHasManagers: [],
        updatedAt: new Date(),
        deletedAt: null,
        createdAt: new Date(),
      };

      jest.spyOn(prismaBaseService.site, 'findUnique').mockResolvedValue(mockSite as any);

      const result = await service.findOne(1, user);

      expect(result).toEqual(mockSite);
      expect(prismaBaseService.site.findUnique).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: undefined },
        select: expect.any(Object),
      });
    });

    it('should throw an error if manager does not have access to the site', async () => {
      const user: UserRequestModel = {
        id: 2,
        username: 'manager2',
        email: 'manager2@example.com',
        emailVerified: true,
        picture: '',
        telNumber: '1234567890',
        createdAt: new Date(),
        activeProfile: {
          role: Role.MANAGER,
          id: 2, // Assuming manager2 does not manage the site
        },
        password: 'password',
      };

      jest.spyOn(prismaBaseService.site, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(1, user)).rejects.toThrowError('Site not found');
    });
  });
  describe('update', () => {
    it('should update a site and return SiteAdminReturn when role is ADMIN', async () => {
        const mockSiteManipulationRequestBody = {
        name: 'Updated Site',
        shortDescription: 'Updated short description',
        longDescription: 'Updated long description',
        telNumber: '9876543210',
        email: 'updatedsite@example.com',
        website: 'http://updatedsite.com',
        price: 300,
        type: SiteType.OTHER,
        tags: [SiteTag.OTHER],
        addressId: 2,
        };
    
        const mockSiteAdminReturn = {
        id: 1,
        uuid: '123',
        name: 'Updated Site',
        shortDescription: 'Updated short description',
        longDescription: 'Updated long description',
        telNumber: '9876543210',
        email: 'updatedsite@example.com',
        website: 'http://updatedsite.com',
        price: 300,
        pictures: [],
        type: SiteType.OTHER,
        tags: [SiteTag.OTHER],
        address: {
            id: 2,
            houseNumber: '456',
            street: 'Updated St',
            fullAddress: '456 Updated St, NewCity, 54321',
            zip: '54321',
            city: {
            id: 2,
            name: 'NewCity',
            zip: '54321',
            department: {
                id: 2,
                name: 'UpdatedDepartment',
                country: { id: 2, name: 'UpdatedCountry' },
            },
            },
            otherDetails: 'Near the updated park',
            latitude: 223.456,
            longitude: 88.910,
        },
        siteHasManagers: [],
        updatedAt: new Date(),
        deletedAt: null,
        createdAt: new Date(),
        };
    
        jest.spyOn(service['prismaBase'].site, 'update').mockResolvedValue(mockSiteAdminReturn as any);
        jest.spyOn(service['picturesService'], 'createPicture').mockResolvedValue({ id: 2, path: '/tmp/test.jpg' } as any);
    
        const result = await service.update(1, mockSiteManipulationRequestBody, Role.ADMIN, {} as any);
    
        expect(service['prismaBase'].site.update).toHaveBeenCalledWith(
        expect.objectContaining({
            where: { id: 1 },
            data: expect.objectContaining({
            name: 'Updated Site',
            address: { connect: { id: 2 } },
            }),
        }),
        );
        expect(result).toEqual(mockSiteAdminReturn);
    });
    
    it('should update a site and return SiteManagerReturn when role is MANAGER', async () => {
        const mockSiteManipulationRequestBody = {
        name: 'Manager Updated Site',
        shortDescription: 'Manager updated short description',
        longDescription: 'Manager updated long description',
        telNumber: '1234567890',
        email: 'managerupdatedsite@example.com',
        website: 'http://managerupdatedsite.com',
        price: 150,
        type: SiteType.OTHER,
        tags: [SiteTag.OTHER],
        addressId: 1,
        };
    
        const mockSiteManagerReturn = {
        id: 1,
        uuid: '123',
        name: 'Manager Updated Site',
        shortDescription: 'Manager updated short description',
        longDescription: 'Manager updated long description',
        telNumber: '1234567890',
        email: 'managerupdatedsite@example.com',
        website: 'http://managerupdatedsite.com',
        price: 150,
        pictures: [],
        type: SiteType.OTHER,
        tags: [SiteTag.OTHER],
        address: {
            id: 1,
            houseNumber: '123',
            street: 'Manager St',
            fullAddress: '123 Manager St, ManagerCity, 12345',
            zip: '12345',
            city: {
            id: 1,
            name: 'ManagerCity',
            zip: '12345',
            department: {
                id: 1,
                name: 'ManagerDepartment',
                country: { id: 1, name: 'ManagerCountry' },
            },
            },
            otherDetails: 'Near the manager park',
            latitude: 123.456,
            longitude: 78.910,
        },
        updatedAt: new Date(),
        deletedAt: null,
        createdAt: new Date(),
        };
    
        jest.spyOn(service['prismaBase'].site, 'update').mockResolvedValue(mockSiteManagerReturn as any);
        jest.spyOn(service['picturesService'], 'createPicture').mockResolvedValue({ id: 2, path: '/tmp/test.jpg' } as any);
    
        const result = await service.update(1, mockSiteManipulationRequestBody, Role.MANAGER, {} as any);
    
        expect(service['prismaBase'].site.update).toHaveBeenCalledWith(
        expect.objectContaining({
            where: { id: 1 },
            data: expect.objectContaining({
            name: 'Manager Updated Site',
            address: { connect: { id: 1 } },
            }),
        }),
        );
        expect(result).toEqual(mockSiteManagerReturn);
    });
  })
});
