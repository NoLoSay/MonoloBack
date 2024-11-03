import { Country, PrismaClient as PrismaBaseClient } from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedCountries(): Promise<Country[]> {
  let countries: Country[] = [];

  countries.push(
    await prisma.country.upsert({
      where: { name: 'France' },
      update: {},
      create: {
        name: 'France',
        code: 'FR',
        latitude: 46.603354,
        longitude: 1.888334,
      },
    }),
  );
  countries.push(
    await prisma.country.upsert({
      where: { name: 'Belgium' },
      update: {},
      create: {
        name: 'Belgium',
        code: 'BE',
        latitude: 50.6402809,
        longitude: 4.6667145,
      },
    }),
  );

  return countries;
}
