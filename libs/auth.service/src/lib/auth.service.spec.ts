import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from "@noloback/users.service";
import { compare }  from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client/base';

jest.mock('@nestjs/jwt');
jest.mock('@noloback/users.service');

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
describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, AuthService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  //login
  describe('login', () => {
    it('should return user', async () => {
      const user = {
        username: "John Doe",
        email: "John.Doe@email.com",
        userId: 123, 
      }
      const userPayload = {
        username: user.username,
        sub: user.userId,
      }

      // Mock the sign method of the JwtService
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');

      const result = await service.login(user);

      //Assert
      expect(result.username).toBe(user.username);
      expect(result.email).toBe(user.email);
      expect(result.access_token).toBe('mocked_token');
      expect(jwtService.sign).toHaveBeenCalledWith(userPayload)
    });
  });

  //validateUser
  describe('validateUser', () => {
    it('should return user if valid login and password', async () => {
      const mockPassword = 'RightPassword';
      
      const { password, ...johnDoeUser2 } = johnDoeUser;
      //mock the findUserByEmailOrUsername
      jest.spyOn(userService, 'findUserByEmailOrUsername').mockResolvedValue(johnDoeUser);
      //mock the compare password
      const bcryptCompare = jest.fn().mockResolvedValue(true);
      (compare as jest.Mock) = bcryptCompare;

      const result = await service.validateUser(johnDoeUser.username, mockPassword);

      expect(result).toEqual(johnDoeUser2);
    });

    it('should return null if wrong password', async () => {
      const mockPassword = 'WrongPassword';
      
      //mock the findUserByEmailOrUsername
      jest.spyOn(userService, 'findUserByEmailOrUsername').mockResolvedValue(null);
      //mock the compare password

      const result = await service.validateUser(johnDoeUser.username, mockPassword);

      const bcryptCompare = jest.fn().mockResolvedValue(false);
      (compare as jest.Mock) = bcryptCompare;

      expect(result).toEqual(null);
    });
  });

  //findUserByUsername
  describe('findUserByUsername', () => {
    it('should return user if find a user with provided username', async () => {

      //mock the findUserByEmailOrUsername
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(johnDoeUser);

      const result = await service.findUserByUsername(johnDoeUser.username);

      expect(result).toEqual(johnDoeUser);
    });

    it('should return null if doesnt find a user with provided username', async () => {
      const mockUsername = "unknownUsername";

      //mock the findUserByEmailOrUsername
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(null);

      const result = await service.findUserByUsername(mockUsername);

      expect(result).toEqual(null);
    });
  });
});
