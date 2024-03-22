export class ProfileCommonReturn {
  id: number = 0
  role: string = ''
  createdAt: Date = new Date()
}

export class ProfileListReturn extends ProfileCommonReturn {
  isActive: boolean = false
}

export class ProfileAdminReturn extends ProfileListReturn {
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
}

/******* SELECT ******/

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
