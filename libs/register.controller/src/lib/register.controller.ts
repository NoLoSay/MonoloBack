import { Body, Controller, Post } from '@nestjs/common'
import { Public } from '@noloback/jwt'
import { UserCreateModel } from '@noloback/api.request.bodies'
import { UsersService } from '@noloback/users.service'

@Controller('register')
export class RegisterController {
  constructor (private readonly usersService: UsersService) {}

  @Post()
  @Public()
  register (@Body() userRegister: UserCreateModel) {
    return this.usersService.create(userRegister)
  }
}
