import {
  City,
  Country,
  Department,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedCities(
  countries: Country[],
  department: Department[]
) {
  let cities: City[] = [];

  const france = countries.find((country) => country.code === 'FR');
  if (france) {
    const loireAtlantique = department.find(
      (department) => department.code === '44'
    );
    if (loireAtlantique) {
      cities.push(
        await prisma.city.upsert({
          where: {
            name_departmentId: {
              name: 'Nantes',
              departmentId: loireAtlantique.id,
            },
          },
          update: {},
          create: {
            name: 'Nantes',
            departmentId: loireAtlantique.id,
            postcode: '44000',
            latitude: 47.2186371,
            longitude: -1.5541362,
          },
        })
      );
    }

    const parisDepartment = department.find(
      (department) => department.code === '75'
    );
    if (parisDepartment) {
      cities.push(
        await prisma.city.upsert({
          where: {
            name_departmentId: {
              name: 'Paris',
              departmentId: parisDepartment.id,
            },
          },
          update: {},
          create: {
            name: 'Paris',
            departmentId: parisDepartment.id,
            postcode: '75000',
            latitude: 48.8588897,
            longitude: 2.320041,
          },
        })
      );
    }
  }

  const belgium = countries.find((country) => country.code === 'BE');
  if (belgium) {
    const bruxellesCapitale = department.find(
      (department) => department.code === 'Bruxelles-Capitale'
    );
    if (bruxellesCapitale) {
      cities.push(
        await prisma.city.upsert({
          where: {
            name_departmentId: {
              name: 'Bruxelles',
              departmentId: bruxellesCapitale.id,
            },
          },
          update: {},
          create: {
            name: 'Bruxelles',
            departmentId: bruxellesCapitale.id,
            postcode: '1000',
            latitude: 50.8465573,
            longitude: 4.351697,
          },
        })
      );
    }
  }

  return cities;
}
