import { PrismaClient as PrismaBaseClient } from '@prisma/client/base'
import * as fs from 'fs'

const prisma = new PrismaBaseClient()

export async function seedCities () {
  const departments = await prisma.department.findMany()

  let cities: any[] = []

  const rawData = fs.readFileSync('seed/datas/cities.json', 'utf-8')
  const citiesData = JSON.parse(rawData)

  for (const cityData of citiesData) {
    const department = departments.find(d => d.code === cityData.departmentCode)
    if (department) {
      try {
        cities.push(
          await prisma.city.upsert({
            where: {
              name_zip_departmentId : {
                name: cityData.name,
                zip: cityData.zip,
                departmentId: department.id
              }
            },
            update: {},
            create: {
              name: cityData.name,
              departmentId: department.id,
              latitude: cityData.latitude,
              longitude: cityData.longitude,
              zip: cityData.zip
            }
          })
        )
      } catch (e) {
        console.error(e, cityData)
      }
    }
  }

  return cities
}
