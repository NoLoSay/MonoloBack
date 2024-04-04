import { ItemCommonSelect } from './items.db.calls'
import { SiteCommonSelect } from './sites.db.calls'

class ExhibitedItem {
    item: object = {
        select: new ItemCommonSelect()
    }
}

export class ExhibitionCommonSelect {
  id: boolean = true
  name: boolean = true
  shortDescription: boolean = true
  longDescription: boolean = true
  startDate: boolean = true
  endDate: boolean = true
  siteId: boolean = true
  site: object = {
    select: new SiteCommonSelect()
  }
}

export class ExhibitionCommonDetailedSelect extends ExhibitionCommonSelect {
  exhibitedItems: object = {
    select: new ExhibitedItem()
  }
}

export class ExhibitionManagerSelect extends ExhibitionCommonSelect {
  createdAt: boolean = true
  updatedAt: boolean = true
}

export class ExhibitionManagerDetailedSelect extends ExhibitionManagerSelect {
  exhibitedItems: object = {
    select: new ExhibitedItem()
  }
}

export class ExhibitionAdminSelect extends ExhibitionManagerSelect {
  deletedAt: boolean = true
}

export class ExhibitionAdminDetailedSelect extends ExhibitionAdminSelect {
  exhibitedItems: object = {
    select: new ExhibitedItem()
  }
}
