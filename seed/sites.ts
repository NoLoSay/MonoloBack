import {
  Address,
  City,
  Country,
  Department,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedSites(
  countries: Country[],
  department: Department[],
  cities: City[]
) {
  let addresses: Address[] = [];

  const france = countries.find((country) => country.code === 'FR');
  if (france) {
    const loireAtlantique = department.find(
      (department) => department.code === '44'
    );
    if (loireAtlantique) {
      const nantes = cities.find((city) => city.name === 'Nantes');
      if (nantes) {
        const chateauDucBretagne = await prisma.address.upsert({
          where: {
            houseNumber_street_zip_cityId: {
              houseNumber: '4',
              street: 'Pl. Marc Elder',
              zip: '44000',
              cityId: nantes.id,
            },
          },
          update: {},
          create: {
            id: 1,
            houseNumber: '4',
            street: 'Pl. Marc Elder',
            zip: '44000',
            cityId: nantes.id,
            longitude: -1.550475,
            latitude: 47.216379,
            sites: {
              createMany: {
                data: [
                  {
                    name: 'Chateau des Ducs de Bretagne',
                    price: 9,
                    type: 'MUSEUM',
                    email: '',
                    telNumber: '+33811464644',
                    website: 'https://www.chateaunantes.fr/',
                    // pictures: {
                    //   createMany: {
                    //     data: [{
                    //       hostingUrl: 'https://www.chateaunantes.fr/wp-content/themes/chateaunantes2020/assets/illustration/home_chateau.jpg',
                    //     }]
                    //   }
                    // },
                    shortDescription: 'Le château de Nantes',
                    longDescription:
                      'Au cœur du quartier médiéval de Nantes, découvrez le Château des ducs de Bretagne, site emblématique de la ville, construit à la fin du 15e siècle par François II et sa fille Anne de Bretagne.',
                  },
                ],
              },
            },
          },
        });
        addresses.push(chateauDucBretagne);

        const manager = await prisma.profile.findFirst({
          where: {
            role: 'MANAGER',
          },
        });
        if (manager) {
          await prisma.siteHasManager.upsert({
            where: {
              profileId_siteId: {
                profileId: manager.id,
                siteId: chateauDucBretagne.id,
              },
            },
            create: {
              profileId: manager.id,
              siteId: chateauDucBretagne.id,
              isMain: true,
            },
            update: {},
          });
        }
      }
    }
  }

  return addresses;
}
