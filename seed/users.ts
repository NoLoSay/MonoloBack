import { PrismaClient as PrismaBaseClient, User } from '@prisma/client/base';
import { hash } from 'bcrypt';

const prisma = new PrismaBaseClient();

export async function seedUsers(): Promise<User[]> {
  let users: User[] = [];

  users.push(
    await prisma.user.upsert({
      where: { email: 'admin@nolosay.com' },
      update: {},
      create: {
        email: 'admin@nolosay.com',
        username: 'Admin',
        password: await hash('password', 12),
        telNumber: '+33600000001',
        profiles: {
          createMany: {
            data: [
              {
                role: 'USER',
                isActive: false,
              },
              {
                role: 'ADMIN',
                isActive: true,
              },
            ],
          },
        },
      },
    })
  );
  users.push(
    await prisma.user.upsert({
      where: { email: 'creator@nolosay.com' },
      update: {},
      create: {
        email: 'creator@nolosay.com',
        username: 'Creator',
        password: await hash('password', 12),
        telNumber: '+33600000002',
        profiles: {
          createMany: {
            data: [
              {
                role: 'USER',
                isActive: false,
              },
              {
                role: 'CREATOR',
                isActive: true,
              },
            ],
          },
        },
      },
    })
  );
  users.push(
    await prisma.user.upsert({
      where: { email: 'user@nolosay.com' },
      update: {},
      create: {
        email: 'user@nolosay.com',
        username: 'User',
        password: await hash('password', 12),
        telNumber: '+33600000003',
        profiles: {
          createMany: {
            data: [
              {
                role: 'USER',
                isActive: true,
              },
            ],
          },
        },
      },
    })
  );
  users.push(
    await prisma.user.upsert({
      where: { email: 'moderator@nolosay.com' },
      update: {},
      create: {
        email: 'moderator@nolosay.com',
        username: 'Moderator',
        password: await hash('password', 12),
        telNumber: '+33600000004',
        profiles: {
          createMany: {
            data: [
              {
                role: 'MODERATOR',
                isActive: true,
              },
              {
                role: 'USER',
                isActive: false,
              },
            ],
          },
        },
      },
    })
  );
  users.push(
    await prisma.user.upsert({
      where: { email: 'manager@nolosay.com' },
      update: {},
      create: {
        email: 'manager@nolosay.com',
        username: 'Manager',
        password: await hash('password', 12),
        telNumber: '+33600000005',
        profiles: {
          createMany: {
            data: [
              {
                role: 'MANAGER',
                isActive: true,
              },
              {
                role: 'USER',
                isActive: false,
              },
            ],
          },
        },
      },
    })
  );
  users.push(
    await prisma.user.upsert({
      where: { email: 'manager2@nolosay.com' },
      update: {},
      create: {
        email: 'manager2@nolosay.com',
        username: 'Manager2',
        password: await hash('password', 12),
        telNumber: '+33600000006',
        profiles: {
          createMany: {
            data: [
              {
                role: 'MANAGER',
                isActive: true,
              },
              {
                role: 'USER',
                isActive: false,
              },
            ],
          },
        },
      },
    })
  );

  return users;
}
