import { PrismaClient as PrismaBaseClient } from '@prisma/client/base';
import { seedUsers } from './users';
import { seedCountries } from './countries';
import { seedDepartments } from './departments';
import { seedCities } from './cities';
import { seedSites } from './sites';
import { seedItemTypes } from './item-types';
import { seedItems } from './items';
import { seedVideos } from './videos';

const prisma = new PrismaBaseClient();
async function main() {
  const users = await seedUsers();
  console.log(users);

  const countries = await seedCountries();
  console.log(countries);

  const departments = await seedDepartments(countries);
  console.log(departments);

  const cities = await seedCities(countries, departments);
  console.log(cities);

  const sites = await seedSites(countries, departments, cities);
  console.log(sites);

  const itemTypes = await seedItemTypes();
  console.log(itemTypes);

  const items = await seedItems();
  console.log(items);

  const videos = await seedVideos();
  console.log(videos);

  console.log('Seeding completed');
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
