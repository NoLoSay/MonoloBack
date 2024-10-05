class Exhibition {
  id: boolean = true
  name: boolean = true
  startDate: boolean = true
  endDate: boolean = true
}

class LinkedExhibition {
  id: boolean = true
  specName: boolean = true
  specDesc: boolean = true
  exhibition: object = {
    select : new Exhibition()
  }
}

export class RoomCommonSelect {
  id: boolean = true
  name: boolean = true
  description: boolean = true
}

export class RoomWithExhibitionsSelect extends RoomCommonSelect {
  linkedExhibitions: object = {
    select : new LinkedExhibition()
  }
}

export class RoomManagerSelect extends RoomCommonSelect {
  createdAt: boolean = true
  updatedAt: boolean = true
}

export class RoomManagerWithExhibitionsSelect extends RoomManagerSelect {
  linkedExhibitions: object = {
    select : new LinkedExhibition()
  }
}

export class RoomAdminSelect extends RoomManagerSelect {
  deletedAt: boolean = true
}

export class RoomAdminWithExhibitionsSelect extends RoomAdminSelect {
  linkedExhibitions: object = {
    select : new LinkedExhibition()
  }
}
