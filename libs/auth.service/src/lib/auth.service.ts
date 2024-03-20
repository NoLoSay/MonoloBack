import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@noloback/users.service';
import { User } from '@prisma/client/base';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    console.log('login', login);
    const user = await this.usersService.connectUserByEmailOrUsername(login);
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<any> {
    const payload = { username: user.email, sub: { uuid: user.uuid } };

    const result = {
      ...user,
      accessToken: this.jwtService.sign(payload),
    };

    return result;
  }

  async connectUserByUsername(username: string) {
    return this.usersService.findOneByUsername(username);
  }

  async connectUserByEmail(email: string) {
    return this.usersService.findOneByEmail(email);
  }
}
