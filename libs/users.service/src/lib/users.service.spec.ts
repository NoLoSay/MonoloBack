import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { RootTestModule } from '@noloback/root.test';
import { UserCreateModel } from '@noloback/api.request.bodies';
import { ConflictException } from '@nestjs/common';
import { LoggerService } from '@noloback/logger-lib';
import { PrismaBaseService } from '@noloback/prisma-client-base';

describe('UsersService', () => {
  let service: UsersService;
  // let fakePrismaUser: UserCreateModel[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: LoggerService,
        useValue: {
          log: jest.fn(),
        },
      },
      {
        provide: PrismaBaseService,
        useValue: {
          // user: {
          //   create: jest.fn((userCreate: UserCreateModel) : any => {
          //     if (fakePrismaUser.find(user => user.email === userCreate.email)) {
          //       throw new ConflictException();
          //     }
          //     fakePrismaUser.push(userCreate);
          //   }),
          //   findUnique: jest.fn(),
          // },
        },
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should create user', async () => {
  //   const createUserDto: UserCreateModel = {
  //     username: 'test',
  //     email: 'test',
  //     password: 'test',
  //   };
  //   const user = await service.create(createUserDto);
  //   expect(user).toBeDefined();
  // });

  // it('should throw on duplicate user', async () => {
  //   const createUserDto: UserCreateModel = {
  //     username: 'test',
  //     email: 'test',
  //     password: 'test',
  //   };
  //   await service.create(createUserDto);
  //   await expect(service.create(createUserDto)).rejects.toThrowError(ConflictException);
  // });
});
