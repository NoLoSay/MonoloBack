class ItemCategorySelect {
  id: boolean = true;
  name: boolean = true;
}

export class ItemTypeCommonSelect {
  id: boolean = true;
  name: boolean = true;
  description: boolean = true;
}

export class ItemTypeDetailledSelect extends ItemTypeCommonSelect {
  itemCategory: object = {
    select: new ItemCategorySelect(),
  };
}

export class ItemTypeAdminSelect extends ItemTypeDetailledSelect {
  createdAt: boolean = true;
  updatedAt: boolean = true;
  deletedAt: boolean = true;
}
