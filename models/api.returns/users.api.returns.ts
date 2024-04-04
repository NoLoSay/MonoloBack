import { ProfileListReturn } from './profiles.api.returns'

export class UserCommonReturn {
  id: number = 0
  username: string = ''
  picture: string = ''
}

export class UserMeReturn extends UserCommonReturn {
  email: string = ''
  createdAt: Date = new Date()
  telNumber: string = ''
  profiles: ProfileListReturn[] = []
}

export class UserAdminReturn extends UserMeReturn {
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
  uuid: string = ''
}