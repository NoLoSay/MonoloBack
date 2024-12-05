import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Req,
  Body,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist';
import { AuthService, UsernamePasswordCombo } from '@noloback/auth.service';
import { LocalAuthGuard } from '@noloback/guards';
import { Public } from '@noloback/jwt';
import { GoogleOAuthGuard, EmailConfirmationGuard } from '@noloback/guards';
import { UserChangePasswordModel } from '@noloback/api.request.bodies';
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

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('web-google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async webLoginWithGoogle(@Req() req: any, @Res() res: any) {
    const user = req.user;
    const response = await this.authService.login(user);
    return res.redirect(`${process.env['GOOGLE_CALLBACK_URL']}account?user=${JSON.stringify(response)}`);
  }

  @Post('change-password')
  @Public()
  async changePassword(@Body() req: UserChangePasswordModel) {
    if (!req.token && !req.oldPassword) {
      throw new BadRequestException(
        'error: you must either give old password and user or just mail token.'
      );
    }
    if ((req.oldPassword && !req.userMail) || (!req.oldPassword && req.userMail)) {
      throw new BadRequestException(
        'error: you must provide both oldPassword and userMail.'
      );
    }
    return this.authService.changePassword(
      req.password,
      req.token,
      req.oldPassword,
      req.userMail
    );

  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() body: any) {
    return this.authService.forgotPassword(body.email);
  }

  @Get('confirm')
  @Public()
  async confirm(@Query('token') token: string) {
    const email =
      await this.mailConfirmationService.decodeConfirmationToken(token);
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
