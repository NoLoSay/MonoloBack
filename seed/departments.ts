import {
  Department,
  PrismaClient as PrismaBaseClient,
} from '@prisma/client/base';
import * as fs from 'fs';

const prisma = new PrismaBaseClient();

export async function seedDepartments() {
  const countries = await prisma.country.findMany();
  let departments: Department[] = [];

  const rawData = fs.readFileSync('seed/datas/departments.json', 'utf-8');
  const departmentsData = JSON.parse(rawData);

  for (const departmentData of departmentsData) {
    const country = countries.find(
      (c) => c.code === departmentData.countryCode,
    );
    if (country) {
      departments.push(
        await prisma.department.upsert({
          where: {
            code_countryId: {
              code: departmentData.code,
              countryId: country.id,
            },
          },
          update: {},
          create: {
            name: departmentData.name,
            code: departmentData.code,
            countryId: country.id,
            latitude: departmentData.latitude,
            longitude: departmentData.longitude,
          },
        }),
      );
    }
  }

  return departments;
}
