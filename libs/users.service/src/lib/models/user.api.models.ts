export class UserCommonReturn {
  id: number = 0
  username: string = ''
  picture: string = ''
}

export class UserMeReturn extends UserCommonReturn {
  email: string = ''
  createdAt: Date = new Date()
  role: string = ''
}

export class UserAdminReturn extends UserMeReturn {
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
  uuid: string = ''
}

/******* SELECT ******/

export class UserCommonSelect {
  id: boolean = true
  username: boolean = true
  picture: boolean = true
}

export class UserMeSelect extends UserCommonSelect {
  email: boolean = true
  createdAt: boolean = true
  role: boolean = true
}

export class UserAdminSelect extends UserMeSelect {
  updatedAt: boolean = true
  deletedAt: boolean = true
  uuid: boolean = true
}
