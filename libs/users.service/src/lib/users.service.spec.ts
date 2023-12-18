import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaBaseService } from '@noloback/prisma-client-base';
import { LoggerService, LoggerLibModule } from '@noloback/logger-lib'; // Update the path
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client/base';
import { describe } from 'node:test';

const johnDoeUser = {
  id: 123,
  username: "John",
  email: "JohnDoe@email.com",
  password: "hashedPassword",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  role: Role.USER,
}

const vincentUser = {
  id: 124,
  username: "Vincent",
  email: "VincentPong@email.com",
  password: "hashedPassword123",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  role: Role.USER,
}

jest.mock('@noloback/prisma-client-base');
jest.mock('@noloback/logger-lib');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaBaseService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        LoggerService,
        LoggerLibModule,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaBaseService>(PrismaBaseService);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(johnDoeUser);

      const createUserDto: CreateUserDto = {
        username: johnDoeUser.username,
        email: johnDoeUser.email,
        password: 'password',
      };
      
      const bcryptCompare = jest.fn().mockResolvedValue('hashedPassword');
      (hash as jest.Mock) = bcryptCompare;
      
      const result = await service.create(createUserDto);
      
      expect(result).toEqual({
        id: johnDoeUser.id,
        username: johnDoeUser.username,
        email: johnDoeUser.email,
      });
    });
  
    it('should throw ConflictException for existing username', async () => {
      // Mock the findUnique method to return a user with the same username
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(johnDoeUser);
      
      const createUserDto: CreateUserDto = {
        username: johnDoeUser.username,
        email: 'new@example.com',
        password: 'password',
      };
      
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
    
    it('should throw ConflictException for existing email', async () => {
      // Mock the findUnique method to return a user with the same email
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(johnDoeUser);
      
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        email: johnDoeUser.email,
        password: 'password',
      };
      
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
    
    it('should throw InternalServerErrorException on create failure', async () => {
      // Mock the findUnique method to return null (indicating no existing user)
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      
      // Mock the create method to throw an error
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(new Error('Prisma create error'));
      
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      
      await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  })
  describe('findAll', () => {
    it('should return all users', async () => {
      // Mock the findMany method to return an array of users
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([
        johnDoeUser,
        vincentUser,
      ]);

      const result = await service.findAll();

      expect(result).toEqual([
        johnDoeUser,
        vincentUser,
      ]);
    })
  });
  describe('findOne', () => {
    it('should return one user by ID', async () => {
      const userId = 123;
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(johnDoeUser);

      const result = await service.findOne(userId);

      expect(result).toEqual(johnDoeUser);
    });
  })
  describe('findOneByUsername', () => {
    it('should return one user by username', async () => {
      const username = johnDoeUser.username;
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(johnDoeUser);

      const result = await service.findOneByUsername(username);

      expect(result).toEqual(johnDoeUser);
    });
  });
  describe('findUserByEmailOrUsername', () => {
    it('should find a user by email', async () => {
      const search = johnDoeUser.email;
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(johnDoeUser);

      const result = await service.findUserByEmailOrUsername(search);

      expect(result).toEqual(johnDoeUser);
    });
    it('should find a user by username', async () => {
      const search = johnDoeUser.username;
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(johnDoeUser);

      const result = await service.findUserByEmailOrUsername(search);

      expect(result).toEqual(johnDoeUser);
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      /* service function to implement */
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const johnDoeDeleted ={
        id: 123,
        username: "John",
        email: "JohnDoe@email.com",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        role: Role.USER,
      } 
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(johnDoeDeleted);

      const result = await service.remove(johnDoeDeleted.id);

      expect(result).toEqual(johnDoeDeleted);
    });
  });
});

