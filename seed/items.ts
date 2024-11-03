import { Item, PrismaClient as PrismaBaseClient } from '@prisma/client/base';
import * as fs from 'fs';

const prisma = new PrismaBaseClient();

export async function newSeedItems(): Promise<Item[]> {
  let items: Item[] = [];

  const rawData = fs.readFileSync('seed/datas/items.json', 'utf-8');
  const itemsData = JSON.parse(rawData);

  for (const itemData of itemsData) {
    const site = await prisma.site.findFirst({
      where: {
        name: { contains: itemData.site.name },
      },
    });
    if (!site) continue;
    const itemType = itemData.itemType
      ? await prisma.itemType.findFirst({
          where: {
            name: { contains: itemData.itemType.name },
          },
        })
      : null;

    const relatedPerson = itemData.relatedPerson
      ? await prisma.person.findFirst({
          where: {
            name: { contains: itemData.relatedPerson.name },
          },
        })
      : null;

    items.push(
      await prisma.item.create({
        data: {
          name: itemData.name,
          description: itemData.description,
          textToTranslate: itemData.textToTranslate,
          itemType: itemType ? { connect: { id: itemType.id } } : undefined,
          site: {
            connect: {
              id: site.id,
            },
          },
          relatedPerson: relatedPerson
            ? { connect: { id: relatedPerson.id } }
            : itemData.relatedPerson
              ? {
                  create: {
                    name: itemData.relatedPerson.name,
                    type: itemData.relatedPerson.type,
                    bio: itemData.relatedPerson.bio,
                    birthDate: itemData.relatedPerson.birthDate,
                    deathDate: itemData.relatedPerson.deathDate,
                  },
                }
              : undefined,
          pictures: itemData.pictures
            ? {
                create: itemData.pictures.map(
                  (picture: { hostingUrl: string }) => ({
                    hostingUrl: picture.hostingUrl,
                  }),
                ),
              }
            : undefined,
        },
      }),
    );
  }

  return items;
}

export async function seedItems(): Promise<Item[]> {
  let items: Item[] = [];

  const chateauDucBretagne = await prisma.site.findFirst({
    where: {
      name: 'Chateau des Ducs de Bretagne',
    },
    include: {
      pictures: true,
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
          const createdItem = await prisma.item.upsert({
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
              site: {
                connect: {
                  id: chateauDucBretagne.id,
                },
              },
              description: chateauDucBretagne.longDescription,
              textToTranslate:
                'text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate text to translate',
              exhibitedBy: {
                createMany: {
                  data: [
                    {
                      exhibitionId: exhibition.id,
                    },
                  ],
                },
              },
              pictures: {
                create: chateauDucBretagne.pictures.map((picture) => ({
                  hostingUrl: picture.hostingUrl,
                })),
              },
            },
          });

          items.push(createdItem);
        }
      }
    }
  }

  return items;
}
