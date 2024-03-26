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
