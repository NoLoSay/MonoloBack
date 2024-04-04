import { SiteManagerCommonDbReturn } from "@noloback/db.returns"

class SiteManagerUser {
  id: number = 0
  email: string = ''
  username: string = ''
}

export class SiteManagerCommonReturn {
  createdAt: Date = new Date()
  isMain: boolean = false
  user = new SiteManagerUser()

  constructor (data: SiteManagerCommonDbReturn) {
    this.createdAt = data.createdAt
    this.isMain = data.isMain
    this.user.id = data.profile.user.id
    this.user.email = data.profile.user.email
    this.user.username = data.profile.user.username
  }
}
