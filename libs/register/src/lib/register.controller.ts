import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@noloback/auth-lib';
import { CreateUserDto, UsersService } from 'libs/users.service/src';

@Controller('register')
export class RegisterController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  register(@Body() userRegister: CreateUserDto) {
    return this.usersService.create(userRegister);
  }
}
