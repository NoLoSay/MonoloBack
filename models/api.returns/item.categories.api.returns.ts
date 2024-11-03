class ItemType {
  id: number = 0;
  name: string = '';
}

export class ItemCategoryCommonReturn {
  id: number = 0;
  name: string = '';
  description: string | null = null;
}

export class ItemCategoryDetailledReturn extends ItemCategoryCommonReturn {
  itemTypes: ItemType = new ItemType();
}

export class ItemCategoryAdminReturn extends ItemCategoryDetailledReturn {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt: Date | null = null;
}
