class Exhibition {
  id: boolean = true
  name: boolean = true
  startDate: boolean = true
  endDate: boolean = true
}

export class RoomCommonSelect {
  id: boolean = true
  name: boolean = true
  description: boolean = true
}

export class RoomWithExhibitionsSelect extends RoomCommonSelect {
  exhibitions: object = {
    select : new Exhibition()
  }
}

export class RoomManagerSelect extends RoomCommonSelect {
  createdAt: boolean = true
  updatedAt: boolean = true
}

export class RoomManagerWithExhibitionsSelect extends RoomManagerSelect {
  exhibitions: object = {
    select : new Exhibition()
  }
}

export class RoomAdminSelect extends RoomManagerSelect {
  deletedAt: boolean = true
}

