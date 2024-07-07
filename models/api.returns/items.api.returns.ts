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

class Picture {
  id: number = 0
  hostingUrl: string = ''
}

export class ItemCommonReturn {
  id: number = 0
  uuid: string = ''
  name: string = ''
  description: string = ''
  textToTranslate: string = ""
  pictures: Picture[] = [new Picture()]
  relatedPerson: Person = new Person()
  itemType: ItemType = new ItemType()
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