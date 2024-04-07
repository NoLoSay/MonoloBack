import {
  VideoCommonListSelect,
  getValidationStatusFromRole
} from '@noloback/video.service'
import { Role } from '@prisma/client/base'

class PersonSelect {
  id: boolean = true
  name: boolean = true
}

class ItemCategorySelect {
  id: boolean = true
  name: boolean = true
}

class ItemTypeSelect {
  id: boolean = true
  name: boolean = true
  itemCategory: object = {
    select: new ItemCategorySelect()
  }
}

export class ItemCommonSelect {
  id: boolean = true
  name: boolean = true
  description: boolean = true
  picture: boolean = true
  relatedPerson: object = {
    select: new PersonSelect()
  }
  itemType: object = {
    select: new ItemTypeSelect()
  }
}

export class ItemDetailedSelect extends ItemCommonSelect {
  videos: object = {}

  constructor (role: Role = Role.USER) {
    super()
    this.videos = {
      select: new VideoCommonListSelect(),
      where: {
        validationStatus: { in: getValidationStatusFromRole(role) }
      }
    }
  }
}

export class ItemManagerSelect extends ItemDetailedSelect {
  createdAt: boolean = true
  updatedAt: boolean = true

  constructor (role: Role = Role.MANAGER) {
    super(role)
  }
}

export class ItemAdminSelect extends ItemManagerSelect {
  deletedAt: boolean = true
  constructor (role: Role = Role.ADMIN) {
    super(role)
  }
}
