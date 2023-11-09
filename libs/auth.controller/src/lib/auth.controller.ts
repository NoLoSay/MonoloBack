import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist';
import { AuthService, LocalAuthGuard, Public, UsernamePasswordCombo } from '@noloback/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBody({ type: UsernamePasswordCombo })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
