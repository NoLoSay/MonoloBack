import { PrismaClient as PrismaBaseClient } from '@prisma/client/base';
import { seedUsers } from './users';
import { seedCountries } from './countries';

const prisma = new PrismaBaseClient();
async function main() {
  const users = await seedUsers();
  console.log(users);

  const countries = await seedCountries();
  console.log(countries);
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

