import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Role } from '@prisma/client/base';
import { CreateUserDto, UsersService } from '@noloback/users.service';
import {
    AuthService,
    LocalAuthGuard,
    Public,
    UsernamePasswordCombo,
  } from '@noloback/auth.service';
import { JwtService } from '@nestjs/jwt';

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

jest.mock('@noloback/auth.service');

describe('UsersController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [UsersService],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should call authService.login with the correct arguments', async () => {
        const user = {
            username: johnDoeUser.username,
            email: johnDoeUser.email,
            userId: johnDoeUser.id, 
        }
    
        jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');
    //Spy on the authService.login method
        jest.spyOn(authService, 'login').mockResolvedValue({
            username: user.username,
            email: user.email,
            access_token: 'mocked_token',
        });

        //await controller.login(user);

        //Assert
        //expect(authService.login).toHaveBeenCalledWith(user);
    });

    // it('should return the result from authService.login', async () => {
    //   // Arrange
    //   const user = { /* mock user object */ };
    //   const req = { user };
    //   const authServiceLoginSpy = jest.spyOn(authService, 'login').mockResolvedValue(/* mock return value */);

    //   // Act
    //   const result = await authController.login(req);

    //   // Assert
    //   expect(result).toEqual(/* expected result based on mock return value */);
    //   expect(authServiceLoginSpy).toHaveBeenCalledWith(user);
    // });

    // it('should use the Public decorator and LocalAuthGuard', async () => {
    //   // Arrange
    //   const publicDecorator = Reflect.getMetadata('isPublic', AuthController.prototype.login);
    //   const useGuardsDecorator = Reflect.getMetadata('useGuards', AuthController.prototype.login);

    //   // Assert
    //   expect(publicDecorator).toBeTruthy();
    //   expect(useGuardsDecorator).toContain(LocalAuthGuard);
    // });

    // // Add more test cases as needed
  });
});

