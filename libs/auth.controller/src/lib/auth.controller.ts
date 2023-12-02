import { Controller, Get, Request, Post, UseGuards, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody } from '@nestjs/swagger/dist';
import {
  AuthService,
  GoogleOAuthGuard,
  LocalAuthGuard,
  Public,
  UsernamePasswordCombo,
} from '@noloback/auth.service';

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

  // @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginWithGoogle(@Req() req: any) {
    const googleUser = req.user;

    console.log(googleUser);
    
    return this.authService.login(googleUser);
  }
}
