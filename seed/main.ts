import { PrismaClient as PrismaBaseClient } from '@prisma/client/base';
import { hash } from 'bcrypt';
import { seedUsers } from './users';

const prisma = new PrismaBaseClient();
async function main() {
  const users = await seedUsers();
  console.log(users);

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

