import {
  Country,
  Department,
  ItemCategory,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedItemTypes(): Promise<ItemCategory[]> {
  let categories: ItemCategory[] = [];

  categories.push(
    await prisma.itemCategory.upsert({
      where: {
        name: 'Architecture',
      },
      update: {},
      create: {
        name: 'Architecture',
        itemTypes: {
          create: [
            {
              name: 'Building',
            },
            {
              name: 'Bridge',
            },
            {
              name: 'Monument',
            },
            {
              name: 'Statue',
            },
            {
              name: 'Tower',
            },
            {
              name: 'Castle',
            },
          ],
        },
      },
    })
  );

  categories.push(
    await prisma.itemCategory.upsert({
      where: {
        name: 'Painting',
      },
      update: {},
      create: {
        name: 'Painting',
        itemTypes: {
          create: [
            {
              name: 'Portrait',
            },
          ],
        },
      },
    })
  );

  return categories;
}
