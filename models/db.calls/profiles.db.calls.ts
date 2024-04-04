export class ProfileCommonSelect {
  id: boolean = true
  role: boolean = true
  createdAt: boolean = true
}

export class ProfileListSelect extends ProfileCommonSelect {
  isActive: boolean = true
}

export class ProfileAdminSelect extends ProfileListSelect {
  updatedAt: boolean = true
  deletedAt: boolean = true
}
