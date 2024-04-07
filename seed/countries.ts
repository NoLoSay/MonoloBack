import { PrismaClient as PrismaBaseClient } from '@prisma/client/base';

const prisma = new PrismaBaseClient();

export async function seedCountries() {
    const france = await prisma.country.upsert({
        where: { name: 'France' },
        update: {},
        create: {
            name: 'France',
            code: 'FR',
        },
    });
    const belgium = await prisma.country.upsert({
        where: { name: 'Belgium' },
        update: {},
        create: {
            name: 'Belgium',
            code: 'BE',
        },
    });
    return { france, belgium };
}
