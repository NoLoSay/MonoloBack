import {
  Country,
  Department,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedDepartments(countries: Country[]) {
  let departments: Department[] = [];

  const france = countries.find((country) => country.code === 'FR');
  if (france) {
    departments.push(
      await prisma.department.upsert({
        where: {
          code_countryId: {
            code: '44',
            countryId: france.id,
          },
        },
        update: {},
        create: {
          name: 'Loire-Atlantique',
          code: '44',
          countryId: france.id,
          latitude: 47.348161,
          longitude: -1.872746,
        },
      })
    );
    departments.push(
      await prisma.department.upsert({
        where: {
          code_countryId: {
            code: '75',
            countryId: france.id,
          },
        },
        update: {},
        create: {
          name: 'Paris',
          code: '75',
          countryId: france.id,
          latitude: 48.8588897,
          longitude: 2.320041,
        },
      })
    );
  }

  const belgium = countries.find((country) => country.code === 'BE');
  if (belgium) {
    departments.push(
      await prisma.department.upsert({
        where: {
          code_countryId: {
            code: 'Bruxelles-Capitale',
            countryId: belgium.id
          }
        },
        update: {},
        create: {
          name: 'Bruxelles-Capitale',
          code: 'Bruxelles-Capitale',
          countryId: belgium.id,
          latitude: 50.503887,
          longitude: 3.939396
        }
      })
    );
  }

  return departments
}
