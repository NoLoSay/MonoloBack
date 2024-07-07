enum PersonType {
  ARTIST,
  WRITER,
  SCIENTIST,
  CELEBRITY,
  OTHER
}

class Item {
  id: number = 0
  name: string = ''
  description: string | null = null
  picture: string | null = null
}

export class PersonCommonReturn {
  id: number = 0
  name: string = ''
  bio: string | null = null
  birthDate: string | null = null
  deathDate: string | null = null
  type: PersonType = PersonType.OTHER
  picture: string | null = null
}

export class PersonDetailledReturn extends PersonCommonReturn {
  items: Item[] = []
}

export class PersonAdminReturn extends PersonDetailledReturn {
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
}
