class ItemTypeSelect {
  id: boolean = true;
  name: boolean = true;
}

export class ItemCategoryCommonSelect {
  id: boolean = true;
  name: boolean = true;
  description: boolean = true;
}

export class ItemCategoryDetailledSelect extends ItemCategoryCommonSelect {
  itemTypes: object = {
    select: new ItemTypeSelect(),
  };
}

export class ItemCategoryAdminSelect extends ItemCategoryDetailledSelect {
  createdAt: boolean = true;
  updatedAt: boolean = true;
  deletedAt: boolean = true;
}
