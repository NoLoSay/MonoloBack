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
                    tags: ['NOLOSAY', 'BLIND_FRIENDLY', 'DEAF_FRIENDLY'],
                    email: '',
                    telNumber: '+33811464644',
                    website: 'https://www.chateaunantes.fr/',
                    shortDescription: 'Le château de Nantes',
                    longDescription:
                      'Au cœur du quartier médiéval de Nantes, découvrez le Château des ducs de Bretagne, site emblématique de la ville, construit à la fin du 15e siècle par François II et sa fille Anne de Bretagne.',
                  },
                ],
              },
            },
          },
        });

        const chateauDucBretagneSite = await prisma.site.findFirst({
          where: {
            addressId: chateauDucBretagne.id,
            name: 'Chateau des Ducs de Bretagne',
          },
        });
        if (chateauDucBretagneSite) {
          await prisma.picture.createMany({
            data: [{
              hostingUrl: 'https://www.chateaunantes.fr/wp-content/themes/chateaunantes2020/assets/illustration/home_chateau.jpg',
              siteId: chateauDucBretagneSite.id
            }]
          });
        }

        const machinesDeLile = await prisma.address.upsert({
          where: {
            houseNumber_street_zip_cityId: {
              houseNumber: '1',
              street: 'Parc des Chantiers',
              zip: '44000',
              cityId: nantes.id,
            },
          },
          update: {},
          create: {
            id: 2,
            houseNumber: '1',
            street: 'Parc des Chantiers',
            zip: '44000',
            cityId: nantes.id,
            longitude: -1.56505,
            latitude: 47.20669,
            sites: {
              createMany: {
                data: [
                  {
                    name: "Machines de l'île",
                    price: 9.5,
                    type: 'PUBLIC_PLACE',
                    tags: [
                      'NOLOSAY',
                      'BLIND_FRIENDLY',
                      'DEAF_FRIENDLY',
                      'DISABILITY_FRIENDLY',
                    ],
                    email: '',
                    telNumber: '+33811464644',
                    website: 'https://www.lesmachines-nantes.fr',
                    shortDescription: 'Lieu historique de la ville de Nantes',
                    longDescription:
                      "Les Machines de l'Île de Nantes est une attraction unique où des machines extraordinaires sont créées et exposées. Inspirées par les univers de Jules Verne et de Léonard de Vinci, ces créations mécaniques, comme le célèbre Grand Éléphant, enchantent les visiteurs par leur ingéniosité et leur grandeur.",
                  },
                ],
              },
            },
          },
        });

        const machinesDeLileSite = await prisma.site.findFirst({
          where: {
            addressId: machinesDeLile.id,
            name: "Machines de l'île",
          },
        });
        if (machinesDeLileSite) {
          await prisma.picture.createMany({
            data: [{
              hostingUrl: 'https://www.sozohotel.fr/cache/picture/m_sozo-hotel-nantes-106286_1155x773_center_center.jpg',
              siteId: machinesDeLileSite.id
            }]
          });
        }

        addresses.push(chateauDucBretagne);
        addresses.push(machinesDeLile);

        if (chateauDucBretagneSite) {
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
                  siteId: chateauDucBretagneSite.id,
                },
              },
              create: {
                profileId: manager.id,
                siteId: chateauDucBretagneSite.id,
                isMain: true,
              },
              update: {},
            });
          }
        }
      }
    }
  }

  return addresses;
}
