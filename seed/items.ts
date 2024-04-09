import {
  Country,
  Department,
  Item,
  ItemCategory,
  PrismaClient as PrismaBaseClient,
  Site,
} from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedItems(): Promise<Item[]> {
  let items: Item[] = [];

  const chateauDucBretagne = await prisma.site.findFirst({
    where: {
      name: 'Chateau des Ducs de Bretagne',
    },
  });

  const architecture = await prisma.itemCategory.findUnique({
    where: {
      name: 'Architecture',
    },
  });
  if (architecture) {
    const castle = await prisma.itemType.findUnique({
      where: {
        name_itemCategoryId: {
          name: 'Castle',
          itemCategoryId: architecture.id,
        },
      },
    });
    if (castle && chateauDucBretagne) {
      const manager = await prisma.profile.findFirst({
        where: {
          managerOf: {
            some: {
              id: chateauDucBretagne.id,
            },
          },
        },
      });

      if (manager) {
        items.push(
          await prisma.item.upsert({
            where: {
              id: chateauDucBretagne.id,
            },
            update: {},
            create: {
              name: 'Chateau des Ducs de Bretagne',
              itemType: {
                connect: {
                  id: castle.id,
                },
              },
              picture: chateauDucBretagne.picture,
              description: chateauDucBretagne.longDescription,
            },
          })
        );
      }
    }
  }

  return items;
}
