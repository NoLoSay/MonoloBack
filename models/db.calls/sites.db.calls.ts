import { AddressCommonSelect } from "./addresses.db.calls"

export class SiteCommonSelect {
  id: boolean = true
  name: boolean = true
  shortDescription: boolean = true
  longDescription: boolean = true
  telNumber: boolean = true
  email: boolean = true
  website: boolean = true
  price: boolean = true
  picture: boolean = true
  type: boolean = true
  tags: boolean = true
  address: object = {
    select: new AddressCommonSelect()
  }
}

export class SiteManagerSelect extends SiteCommonSelect {
  createdAt: boolean = true
}

export class SiteAdminSelect extends SiteManagerSelect{
  updatedAt: boolean = true
  deletedAt: boolean = true
}
