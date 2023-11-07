import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth-lib.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'role.user') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.PASSPORT_SESSION_KEY,
        });
    }

    async validate(payload: any) {
        const user = await this.authService.findUserByUsername(payload.username);
        if (!user || (user.role !== 'USER' && user.role !== 'ADMIN')) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
