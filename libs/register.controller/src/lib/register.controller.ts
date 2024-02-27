import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@noloback/jwt';
import { CreateUserDto, UsersService } from '@noloback/users.service';
import {MailConfirmationService } from '@noloback/mail-confirmation'

@Controller('register')
export class RegisterController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailConfirmationService: MailConfirmationService,) {}

  @Post()
  @Public()
  async register(@Body() userRegister: CreateUserDto) {
    await this.mailConfirmationService.sendVerificationLink(userRegister.email);
    return this.usersService.create(userRegister);
  }
}
