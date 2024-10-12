import {
  Exhibition,
  PrismaClient as PrismaBaseClient
} from '@prisma/client/base'

const prisma = new PrismaBaseClient()

export async function newSeedExhibitions () {
  let exhibitions: object[] = []

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

  // Create random exhibitions for each site
  let currentDate = new Date()

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
      const items = site.items
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
        }
      })

      exhibitions.push(exhibition)
      currentDate = new Date(endDate) // Update currentDate to the end date of the last exhibition
    }
  }

  return exhibitions
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
