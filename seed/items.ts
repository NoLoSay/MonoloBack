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
        const exhibition = await prisma.exhibition.findFirst({
          where: {
            siteId: chateauDucBretagne.id,
          },
        });

        if (exhibition) {
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
                textToTranslate: "text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate",
                exhibitedBy: {
                  createMany: {
                    data: [
                      {
                        exhibitionId: exhibition.id,
                      },
                    ],
                  },
                },
              },
            })
          );
        }
      }
    }
  }

  return items;
}
