import {
  Address,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';
import * as fs from 'fs'

const prisma = new PrismaBaseClient();


export async function seedSites() {
  let address: Address[] = [];

  const rawData = fs.readFileSync('seed/datas/sites.json', 'utf-8')
  const sitesData = JSON.parse(rawData)

  try {
    for (const siteData of sitesData) {
      const city = await prisma.city.findFirst({
        where: {
          name: siteData.address.cityName,
          zip:  {contains: siteData.address.zip.substring(0, 2)},

        },
      });

      if (!city) {
        console.error(`Ville non trouvée: ${siteData.address.cityName}`);
        continue;
      }

      // Upsert de l'adresse et création des sites associés
      address.push( await prisma.address.upsert({
        where: {
          houseNumber_street_zip_cityId: {
            houseNumber: siteData.address.houseNumber,
            street: siteData.address.street,
            zip: siteData.address.zip,
            cityId: city.id,
          },
        },
        update: {},
        create: {
          houseNumber: siteData.address.houseNumber,
          street: siteData.address.street,
          zip: siteData.address.zip,
          cityId: city.id,
          longitude: siteData.address.longitude,
          latitude: siteData.address.latitude,
          sites: {
            create: {
              name: siteData.site.name,
              price: siteData.site.price,
              type: siteData.site.type,
              tags: siteData.site.tags,
              email: siteData.site.email,
              telNumber: siteData.site.telNumber,
              website: siteData.site.website,
              shortDescription: siteData.site.shortDescription,
              longDescription: siteData.site.longDescription,
            },
          },
        },
      })
    );
    }

    console.log('Seeding des sites terminé avec succès.');
  } catch (error) {
    console.error('Erreur lors du seeding des sites:', error);
  } finally {
    await prisma.$disconnect();
  }

  return address;
}