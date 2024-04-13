import {
  Exhibition,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedExhibitions() {
  let exhibitions: Exhibition[] = [];

  const castle = await prisma.site.findFirst({
    where: {
      name: 'Chateau des Ducs de Bretagne',
    },
  });

  if (castle) {
    await prisma.exhibition.upsert({
      where: {
        name_siteId: {
          name: 'Test Exhibition',
          siteId: castle.id,
        },
      },
      update: {},
      create: {
        name: 'Test Exhibition',
        siteId: castle.id,
        shortDescription: 'Test Exhibition',
        longDescription:
          'Test Exhibition long description, actually not that long but still long enough to be considered long',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2124-12-31'),
      },
    });
  }

  return exhibitions;
}
