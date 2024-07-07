import { VideoCommonReturn } from "./videos.api.returns"

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
  itemCategory: ItemCategory = new ItemCategory()
}

class Site {
  id: number = 0
  name: string = ''
}

export class ItemCommonReturn {
  id: number = 0
  uuid: string = ''
  name: string = ''
  description: string = ''
  picture: string = ''
  relatedPerson: Person = new Person()
  itemType: ItemType = new ItemType()
  site: Site = new Site()
}

export class ItemDetailedReturn extends ItemCommonReturn {
  videos: VideoCommonReturn[] = []
}

export class ItemManagerReturn extends ItemDetailedReturn {
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
}

export class ItemAdminReturn extends ItemManagerReturn {
  deletedAt: Date | null = null
}