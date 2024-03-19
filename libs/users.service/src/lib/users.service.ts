import { PrismaBaseService, User } from '@noloback/prisma-client-base';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { LoggerService } from '@noloback/logger-lib';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogCriticity } from '@prisma/client/logs';

@Injectable()
export class UsersService {
  constructor(
    private prismaBase: PrismaBaseService,
    private loggingService: LoggerService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userUsername: User | null = await this.prismaBase.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (userUsername != null) {
      throw new ConflictException('Username already taken');
    }

    const userEmail: User | null = await this.prismaBase.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (userEmail != null) {
      throw new ConflictException('Email address already taken');
    }

    const newUser: User = await this.prismaBase.user
      .create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: await hash(createUserDto.password, 12),
          emailVerified: false,
        },
      })
      .catch((e: Error) => {
        this.loggingService.log(
          LogCriticity.Critical,
          this.constructor.name,
          e
        );
        throw new InternalServerErrorException();
      });

    await this.prismaBase.userLoginLog.create({
      data: {
        userId: newUser.id,
      },
    });

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
  }
  async markEmailAsConfirmed(email: string) {
    return this.prismaBase.user.update({
      where: { email: email },
      data: {
        emailVerified: true,
      },
    });
  }

  findAll() {
    return this.prismaBase.user.findMany({ where: { deletedAt: null } });
  }

  findOne(id: number) {
    return this.prismaBase.user.findUnique({ where: { id: id } });
  }

  findOneByUsername(username: string) {
    return this.prismaBase.user.findUnique({ where: { username: username } });
  }

  findOneByEmail(username: string) {
    return this.prismaBase.user.findUnique({ where: { email: username } });
  }

  async findUserByEmailOrUsername(search: string) {
    const user = await this.prismaBase.user.findFirst({
      where: {
        OR: [
          {
            email: search,
          },
          {
            username: search,
          },
        ],
      },
    });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.prismaBase.user.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });
  }
}
