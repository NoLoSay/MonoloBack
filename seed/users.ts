import { PrismaClient as PrismaBaseClient, User } from '@prisma/client/base';
import { hash } from 'bcrypt';

const prisma = new PrismaBaseClient();

export async function seedUsers(): Promise<User[]> {
  let users: User[] = [];

  users.push(
    await prisma.user.upsert({
      where: { email: 'alice@nolosay.com' },
      update: {},
      create: {
        email: 'alice@nolosay.com',
        username: 'Alice',
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
      where: { email: 'bob@nolosay.com' },
      update: {},
      create: {
        email: 'bob@nolosay.com',
        username: 'Bob',
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
      where: { email: 'john@nolosay.com' },
      update: {},
      create: {
        email: 'john@nolosay.com',
        username: 'John',
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
      where: { email: 'jane@nolosay.com' },
      update: {},
      create: {
        email: 'jane@nolosay.com',
        username: 'Jane',
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
      where: { email: 'richard@nolosay.com' },
      update: {},
      create: {
        email: 'richard@nolosay.com',
        username: 'Richard',
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

  return users;
}
