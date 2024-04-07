import { PrismaClient as PrismaBaseClient } from '@prisma/client/base';
import { hash } from "bcrypt";

const prisma = new PrismaBaseClient();

export async function seedUsers() {
  const alice = await prisma.user.upsert({
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
  });
  const bob = await prisma.user.upsert({
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
  });
  const john = await prisma.user.upsert({
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
  });
  const jane = await prisma.user.upsert({
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
  });
  const richard = await prisma.user.upsert({
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
  });
  return { alice, bob, john, jane, richard };
}
