import {
  Exhibition,
  Site,
  PrismaClient as PrismaBaseClient
} from '@prisma/client/base'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaBaseClient()

async function randomSeeding (sites: any[], filePath: string) {
  let exhibitions: object[] = []
  let currentDate = new Date()

  console.log('Randomly seeding exhibitions')

  // Create random exhibitions for each site
  for (const site of sites) {
    // create a random number of exhibitions limited to 5
    const numberOfExhibitions = Math.floor(Math.random() * 5) + 1

    for (let i = 0; i < numberOfExhibitions; i++) {
      const startDate = new Date(currentDate)
      const endDate = new Date(startDate)
      endDate.setDate(
        endDate.getDate() + Math.floor(Math.random() * (180 - 14 + 1)) + 14
      ) // Random duration between 2 weeks (14 days) and 6 months (180 days)

      // Select a random number of items from the site's items
      const numberOfItems = Math.floor(Math.random() * site.items.length) + 1
      const items: { id: number; name: string }[] = site.items
        .sort(() => 0.5 - Math.random())
        .slice(0, numberOfItems)

      const exhibition = await prisma.exhibition.upsert({
        where: {
          name_siteId: {
            name: `Exposition à ${site.name} numéro ${i + 1}`,
            siteId: site.id
          }
        },
        update: {},
        create: {
          name: `Exposition à ${site.name} numéro ${i + 1}`,
          siteId: site.id,
          shortDescription: `Exposition à ${site.name} numéro ${i + 1}`,
          longDescription: `Exposition à ${site.name} description longue, en fait pas si longue mais suffisamment longue pour être considérée comme longue`,
          startDate: startDate,
          endDate: endDate,
          exhibitedItems: {
            create: items.map(item => {
              return {
                itemId: item.id
              }
            })
          }
        },
        select: {
          id: true,
          name: true,
          shortDescription: true,
          longDescription: true,
          startDate: true,
          endDate: true,
          site: {
            select: {
              id: true,
              name: true
            }
          },
          exhibitedItems: {
            select: {
              item: {
                select: {
                  id: true,
                  name: true,
                  site: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      exhibitions.push(exhibition)
      currentDate = new Date(endDate.getDate() + 1) // Update currentDate to the end date of the last exhibition
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(exhibitions, null, 2), 'utf-8')

  return exhibitions
}

async function seedFromExistingData (sites: any[], filePath: string) {
  let exhibitions: object[] = []

  const rawData = fs.readFileSync(filePath, 'utf-8')
  const exhibitionsData = JSON.parse(rawData)

  console.log('Seeding exhibitions from existing data')

  for (const exhibitionData of exhibitionsData) {
    const site = sites.find(
      site =>
        site.id === exhibitionData.site.id &&
        site.name === exhibitionData.site.name
    )

    if (!site) {
      console.error(
        `Site not found: ${exhibitionData.site.name} (${exhibitionData.site.id})`
      )
      continue
    }

    const exhibition = await prisma.exhibition.upsert({
      where: {
        name_siteId: {
          name: exhibitionData.name,
          siteId: site.id
        }
      },
      update: {},
      create: {
        name: exhibitionData.name,
        siteId: site.id,
        shortDescription: exhibitionData.shortDescription,
        longDescription: exhibitionData.longDescription,
        startDate: new Date(exhibitionData.startDate),
        endDate: new Date(exhibitionData.endDate)
      }
    })

    await prisma.exhibitedItem.createMany({
      data: exhibitionData.exhibitedItems.map((exhibitedItem: any) => {
        return {
          exhibitionId: exhibition.id,
          itemId: exhibitedItem.item.id
        }
      })
    })

    exhibitions.push(
      (await prisma.exhibition.findUnique({
        where: {
          id: exhibition.id
        },
        select: {
          id: true,
          name: true,
          shortDescription: true,
          longDescription: true,
          startDate: true,
          endDate: true,
          site: {
            select: {
              id: true,
              name: true
            }
          },
          exhibitedItems: {
            select: {
              item: {
                select: {
                  id: true,
                  name: true,
                  site: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      })) ?? exhibition // Just because TypeScript is not smart enough to know that the exhibition is not null
    )

    exhibitions.push(exhibition)
  }
  return exhibitions
}

export async function newSeedExhibitions () {
  const filePath = path.join(__dirname, 'datas/exhibitions.json')

  const sites = await prisma.site.findMany({
    select: {
      id: true,
      name: true,
      items: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (fs.existsSync(filePath)) {
    return seedFromExistingData(sites, filePath)
  } else {
    return randomSeeding(sites, filePath)
  }
}

export async function seedExhibitions () {
  let exhibitions: Exhibition[] = []

  const castle = await prisma.site.findFirst({
    where: {
      name: 'Chateau des Ducs de Bretagne'
    }
  })

  if (castle) {
    await prisma.exhibition.upsert({
      where: {
        name_siteId: {
          name: 'Test Exhibition',
          siteId: castle.id
        }
      },
      update: {},
      create: {
        name: 'Test Exhibition',
        siteId: castle.id,
        shortDescription: 'Test Exhibition',
        longDescription:
          'Test Exhibition long description, actually not that long but still long enough to be considered long',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2124-12-31')
      }
    })
  }

  return exhibitions
}
