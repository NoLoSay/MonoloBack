import { Injectable } from '@nestjs/common';
import { PrismaService } from '@noloback/prisma-client-base';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ where: { deletedAt: null } });
  }
}
