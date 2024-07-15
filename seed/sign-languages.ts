import { PrismaClient, SignLanguage } from '@prisma/client/base'

const prisma = new PrismaClient()

function getRandomHexColor (): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export async function seedSignLanguages (): Promise<SignLanguage[]> {
  let signLanguages: SignLanguage[] = []

  signLanguages.push(
    await prisma.signLanguage.upsert({
      where: { name: 'Langue des Signes Française' },
      update: {},
      create: {
        name: 'Langue des Signes Française',
        code: 'LSF',
        color: getRandomHexColor()
      }
    })
  )

  signLanguages.push(
    await prisma.signLanguage.upsert({
      where: { name: 'Langue des Signes de Belgique Francophone' },
      update: {},
      create: {
        name: 'Langue des Signes de Belgique Francophone',
        code: 'LSFB',
        color: getRandomHexColor()
      }
    })
  )

  signLanguages.push(
    await prisma.signLanguage.upsert({
      where: { name: 'Vlaamse Gebarentaal' },
      update: {},
      create: {
        name: 'Vlaamse Gebarentaal',
        code: 'VGT',
        color: getRandomHexColor()
      }
    })
  )

  signLanguages.push(
    await prisma.signLanguage.upsert({
      where: { name: 'Deutschschweizerische Gebärdensprache' },
      update: {},
      create: {
        name: 'Deutschschweizerische Gebärdensprache',
        code: 'DSGS',
        color: getRandomHexColor()
      }
    })
  )

  signLanguages.push(
    await prisma.signLanguage.upsert({
      where: { name: 'American Sign Language' },
      update: {},
      create: {
        name: 'American Sign Language',
        code: 'ASL',
        color: getRandomHexColor()
      }
    })
  )

  signLanguages.push(
    await prisma.signLanguage.upsert({
      where: { name: 'British Sign Language' },
      update: {},
      create: {
        name: 'British Sign Language',
        code: 'BSL',
        color: getRandomHexColor()
      }
    })
  )

  return signLanguages
}
