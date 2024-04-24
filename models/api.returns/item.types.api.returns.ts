class ItemCategory {
  id: number = 0
  name: string = ''
}

export class ItemTypeCommonReturn {
  id: number = 0
  name: string = ''
  description: string | null = null
}

export class ItemTypeDetailledReturn extends ItemTypeCommonReturn {
  itemCategory: ItemCategory = new ItemCategory
}

export class ItemTypeAdminReturn extends ItemTypeDetailledReturn {
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
}
