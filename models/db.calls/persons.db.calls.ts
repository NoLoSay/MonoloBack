class ItemSelect {
  id: boolean = true
  name: boolean = true
  description: boolean = true
  picture: boolean = true
}

export class PersonCommonSelect {
  id: boolean = true
  name: boolean = true
  bio: boolean = true
  birthDate: boolean = true
  deathDate: boolean = true
  type: boolean = true
}

export class PersonDetailledSelect extends PersonCommonSelect {
  items: object = {
    select: new ItemSelect()
  }
}

export class PersonAdminSelect extends PersonDetailledSelect {
  createdAt: boolean = true
  updatedAt: boolean = true
  deletedAt: boolean = true
}
