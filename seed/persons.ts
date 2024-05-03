import {
  PrismaClient as PrismaBaseClient,
  Person,
  PersonType
} from '@prisma/client/base'

const prisma = new PrismaBaseClient()

export async function seedPersons () {
  let persons: Person[] = []

  persons.push(
    await prisma.person.create({
      data: {
        name: 'Max Verstappen',
        birthDate: new Date('1997-09-30T00:00:00Z'),
        bio: "Plus rapide que l'aclair ... Je suis Flash McQuee.. .. Max Verstappen!",
        type: PersonType.CELEBRITY,
        items: {
          create: [
            {
              name: "La tete d'un Epoutanflus",
              description:
                "Une relique datant de l'age epoustanflesque decouverte par Verstappen en attendant que ses concurents finissent la course..."
            }
          ]
        }
      }
    })
  )
  persons.push(
    await prisma.person.create({
      data: {
        name: 'Teuse',
        birthDate: new Date('2002-01-17T00:00:00.000Z'),
        bio: "En chantier ! Je m'appelle TEUSE",
        type: PersonType.OTHER
      }
    })
  )

  return persons
}
