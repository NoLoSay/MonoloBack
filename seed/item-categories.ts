import {
  Country,
  Department,
  ItemCategory,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';
import * as fs from 'fs';

const prisma = new PrismaBaseClient();

export async function newSeedItemCategories() {
  let categories: object[] = [];
  const rawData = fs.readFileSync('seed/datas/item.categories.json', 'utf-8');
  const itemCategorieData = JSON.parse(rawData);

  for (const itemCategory of itemCategorieData) {
    const category = await prisma.itemCategory.upsert({
      where: { name: itemCategory.name },
      update: {},
      create: {
        name: itemCategory.name,
        description: itemCategory.description ?? undefined,
      },
      select: {
        id: true,
        name: true,
        description: true,
        itemTypes: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    const itemTypes = itemCategory.associatedTypes.map(
      async (itemType: { name: string; description?: string }) => {
        const type = await prisma.itemType.upsert({
          where: {
            name_itemCategoryId: {
              name: itemType.name,
              itemCategoryId: category.id,
            },
          },
          update: {},
          create: {
            name: itemType.name,
            description: itemType.description ?? undefined,
            itemCategoryId: category.id,
          },
          select: {
            id: true,
            name: true,
            description: true,
          },
        });
        return type;
      },
    );

    category.itemTypes = itemTypes;
    categories.push(category);
  }

  return categories;
}

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
    }),
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
    }),
  );

  return categories;
}
