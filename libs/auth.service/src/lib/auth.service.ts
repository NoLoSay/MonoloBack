import { Injectable } from '@nestjs/common';
import { UsersService } from 'libs/users.service/src';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    console.log(login, pass);
    const user = await this.usersService.findUserByEmailOrUsername(login);
    if (user && await compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      username: user.username,
      email: user.email,
      access_token: this.jwtService.sign(payload)
    };
  }

  async findUserByUsername(username: string) {
    return this.usersService.findOneByUsername(username);
  }
}
