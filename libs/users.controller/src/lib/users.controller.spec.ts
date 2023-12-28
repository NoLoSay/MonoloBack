import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { Role } from '@prisma/client/base';
import { CreateUserDto, UsersService } from '@noloback/users.service';

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

jest.mock('@noloback/users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([
        johnDoeUser,
        vincentUser,
      ]);

      const result = await controller.findAll();

      expect(result).toEqual([
        johnDoeUser,
        vincentUser,
      ]);
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(johnDoeUser);

      const result = await controller.findOne(1);

      expect(result).toEqual(johnDoeUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: johnDoeUser.username,
        email: johnDoeUser.email,
        password: johnDoeUser.password,
      };

      jest.spyOn(usersService, 'create').mockResolvedValue({
        id: 3,
        ...createUserDto,
      });

      const result = await controller.create(createUserDto);

      expect(result).toEqual({
        id: 3,
        ...createUserDto,
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      /*update userservice and UpdateUserDto are not implemented yet*/
    });
  });
});

