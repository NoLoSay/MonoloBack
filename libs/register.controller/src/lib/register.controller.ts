import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { Public } from '@noloback/jwt';
import { UserCreateModel } from '@noloback/api.request.bodies'
import { UsersService } from '@noloback/users.service';
import {MailConfirmationService } from '@noloback/mail-confirmation'

@Controller('register')
export class RegisterController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailConfirmationService: MailConfirmationService,) {}

  @Post()
  @Public()
   async register(@Body() userRegister: UserCreateModel) {
    await this.mailConfirmationService.sendVerificationLink(userRegister.email);
    return this.usersService.create(userRegister);
  }

  @Get('confirm')
  @Public()
  async confirm(@Query('token') token: string) {
    const email = await this.mailConfirmationService.decodeConfirmationToken(token);
    await this.mailConfirmationService.confirmEmail(email);
  }
}
