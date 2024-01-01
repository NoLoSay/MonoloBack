import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@noloback/jwt';
import { CreateUserDto, UsersService } from '@noloback/users.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  register(@Body() userRegister: CreateUserDto) {
    return this.usersService.create(userRegister);
  }
}
