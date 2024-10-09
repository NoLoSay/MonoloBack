import { PrismaClient as PrismaBaseClient } from '@prisma/client/base';
import { seedUsers } from './users';
import { seedCountries } from './countries';
import { seedDepartments } from './departments';
import { seedCities } from './cities';
import { seedSites } from './sites';
import { seedItemTypes } from './item-types';
import { seedItems } from './items';
import { seedVideos } from './videos';
import { seedExhibitions } from './exhibitions';
import { seedPersons } from './persons';
import { seedEnumsColors } from './enums-colors';
import { seedSignLanguages } from './sign-languages';

const prisma = new PrismaBaseClient();
async function main() {
  const users = await seedUsers();
  console.log(users);

  const countries = await seedCountries();
  console.log(countries);

  const departments = await seedDepartments();
  console.log(departments);

  const cities = await seedCities();
  console.log(cities);

  const sites = await seedSites(countries, departments, cities);
  console.log(sites);

  const exhibitions = await seedExhibitions();
  console.log(exhibitions);

  const itemTypes = await seedItemTypes();
  console.log(itemTypes);

  const items = await seedItems();
  console.log(items);

  const signLanguages = await seedSignLanguages();
  console.log(signLanguages);

  const videos = await seedVideos();
  console.log(videos);

  const persons = await seedPersons();
  console.log(persons);

  const enumsColors = await seedEnumsColors();
  console.log(enumsColors);

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
