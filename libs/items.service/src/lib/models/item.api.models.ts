import {
  VideoCommonListReturn,
  VideoCommonListSelect,
  getValidationStatusFromRole
} from '@noloback/video.service'

class Person {
  id: number = 0
  name: string = ''
}

class ItemCategory {
  id: number = 0
  name: string = ''
}

class ItemType {
  id: number = 0
  name: string = ''
  ItemCategory: ItemCategory = new ItemCategory()
}

export class ItemCommonReturn {
  id: number = 0
  name: string = ''
  description: string = ''
  picture: string = ''
  RelatedPerson: Person = new Person()
  ItemType: ItemType = new ItemType()
}

export class ItemDetailedReturn extends ItemCommonReturn {
  videos: VideoCommonListReturn[] = []
}

export class ItemAdminReturn extends ItemDetailedReturn {
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
}

/******* DATABASE REQUEST ******/

class PersonSelect {
  id: boolean = true
  name: boolean = true
}

class ItemCategorySelect {
  id: boolean = true
  name: boolean = true
}

class ItemTypeSelect {
  id: boolean = true
  name: boolean = true
  ItemCategory: object = {
    select: new ItemCategorySelect()
  }
}

export class ItemCommonSelect {
  id: boolean = true
  name: boolean = true
  description: boolean = true
  picture: boolean = true
  RelatedPerson: object = {
    select: new PersonSelect()
  }
  ItemType: object = {
    select: new ItemTypeSelect()
  }
}

export class ItemDetailedSelect extends ItemCommonSelect {
  Videos: object = {}

  constructor (role: 'ADMIN' | 'REFERENT' | 'USER' = 'USER') {
    super()
    this.Videos = {
      select: new VideoCommonListSelect(),
      where: {
        validationStatus: { in: getValidationStatusFromRole(role) }
      }
    }
  }
}

export class ItemAdminSelect extends ItemDetailedSelect {
  createdAt: boolean = true
  updatedAt: boolean = true
  deletedAt: boolean = true
  constructor (role: 'ADMIN' | 'REFERENT' | 'USER' = 'ADMIN') {
    super(role)
  }
}
