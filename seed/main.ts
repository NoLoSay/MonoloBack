import { PrismaClient as PrismaBaseClient } from '@prisma/client/base';
import { seedUsers } from './users';
import { seedCountries } from './countries';
import { seedDepartments } from './departments';
import { seedCities } from './cities';
import { seedSites } from './sites';
import { newSeedItemCategories } from './item-categories';
import { newSeedItems } from './items';
import { seedVideos } from './videos';
import { seedExhibitions } from './exhibitions';
import { seedEnumsColors } from './enums-colors';
import { seedSignLanguages } from './sign-languages';

const prisma = new PrismaBaseClient();
async function main() {
  const countries = await seedCountries();
  console.log(countries);

  const departments = await seedDepartments();
  console.log(departments);

  const cities = await seedCities();
  console.log(cities);

  const sites = await seedSites();
  console.log(sites);

  const exhibitions = await seedExhibitions();
  console.log(exhibitions);

  const itemCategories = await newSeedItemCategories();
  console.log(itemCategories);

  const items = await newSeedItems();
  console.log(items);

  const signLanguages = await seedSignLanguages();
  console.log(signLanguages);

  const videos = await seedVideos();
  console.log(videos);

  const enumsColors = await seedEnumsColors();
  console.log(enumsColors);
  
  const users = await seedUsers();
  console.log(users);


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
