import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { CreateUserDto, UsersService } from '@noloback/users.service';

jest.mock('@noloback/users.service');
describe('UsersController', () => {
  let controller: RegisterController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [UsersService],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
    service = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should register a user and return the result', async () => {
      // Arrange
      const mockUserRegister: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        email: "testuser@email.com"
      };
      const createdUser = {
        id: 1,
        username: mockUserRegister.username,
        email: mockUserRegister.email
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdUser);

      const result = await controller.register(mockUserRegister);

      expect(result).toEqual(createdUser);
      expect(service.create).toHaveBeenCalledWith(mockUserRegister);
    });
  });
});
