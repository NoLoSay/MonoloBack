import {
  Address,
  City,
  Country,
  Department,
  PrismaClient as PrismaBaseClient,
  Site,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedSites(
  countries: Country[],
  department: Department[],
  cities: City[],
  addresses: Address[]
) {
  let sites: Site[] = [];

  const france = countries.find((country) => country.code === 'FR');
  if (france) {
    const loireAtlantique = department.find(
      (department) => department.code === '44'
    );
    if (loireAtlantique) {
      const nantes = cities.find((city) => city.name === 'Nantes');
      if (nantes) {
        const addressCastle = addresses.find(
          (address) =>
            address.houseNumber === '4' &&
            address.street === 'Pl. Marc Elder' &&
            address.zip === '44000' &&
            address.cityId === nantes.id
        );
        if (addressCastle) {
          // sites.push(await prisma.site.upsert({ where: {

          // } }));
        }
      }
    }
  }

  return sites;
}
