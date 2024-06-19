import { Controller, Get, Request, Post, UseGuards, Req, Body, Query } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist';
import { AuthService, UsernamePasswordCombo } from '@noloback/auth.service';
import { LocalAuthGuard } from '@noloback/guards';
import { Public } from '@noloback/jwt';
import { GoogleOAuthGuard, EmailConfirmationGuard } from '@noloback/guards';
import { PasswordModel } from '@noloback/api.request.bodies';
import { MailConfirmationService } from '@noloback/mail-confirmation.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly mailConfirmationService: MailConfirmationService,
  ) {}

  @Public()
  @ApiBody({ type: UsernamePasswordCombo })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginWithGoogle(@Req() req: any) {
    const user = req.user;

    return this.authService.login(user);
  }

  @Post('change-password')
  @Public()
  async changePassword(@Body() req: PasswordModel) {
    return this.authService.changePassword(req.token, req.password);
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() body: any) {
    return this.authService.forgotPassword(body.email);
  }
  
  @Get('confirm')
  @Public()
  async confirm(@Query('token') token: string) {
    const email = await this.mailConfirmationService.decodeConfirmationToken(token);
    return this.mailConfirmationService.confirmEmail(email);
  }

  // // @Public()
  // @UseGuards(InstagramOAuthGuard)
  // @Get('instagram')
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // async loginWithInstagram(@Req() req: any) {
  //   const user = req.user;

  //   return this.authService.login(user);
  // }

  // // @Public()
  // @UseGuards(FacebookOAuthGuard)
  // @Get('facebook')
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // async loginWithFacebook(@Req() req: any) {
  //   const user = req.user;

  //   return this.authService.login(user);
  // }
}
