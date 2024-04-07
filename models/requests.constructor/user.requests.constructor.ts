import { Role } from "@prisma/client/base"

export class RequestActiveProfile {
  role: Role = Role.USER
  id: number = 0
}

export class UserRequestModel {
  id: number = 0
  username: string = ''
  password: string | undefined = undefined
  email: string = ''
  emailVerified: Boolean = false
  picture: string = ''
  telNumber: string = ''
  createdAt: Date = new Date()
  activeProfile: RequestActiveProfile = new RequestActiveProfile()
}

/******* SELECT ******/

export class RequestActiveProfileSelect {
  role: boolean = true
  id: boolean = true
}

export class UserRequestSelect {
  id: boolean = true
  username: boolean = true
  password: boolean = true
  email: boolean = true
  picture: boolean = true
  telNumber: boolean = true
  createdAt: boolean = true
  activeProfile: object = {
    select: new RequestActiveProfile()
  }
}
