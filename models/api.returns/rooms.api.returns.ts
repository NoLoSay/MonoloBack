class Exhibition {
  id: number = 0
  name: string = ''
  startDate: Date = new Date()
  endDate: Date = new Date()
}

class LinkedExhibition {
  id: number = 0
  specName: string = ''
  specDesc: string = ''
  exhibition: Exhibition = new Exhibition()
}

export class RoomCommonReturn {
  id: number = 0
  name: string = ''
  description: string | undefined
}

export class RoomWithExhibitionsReturn extends RoomCommonReturn {
  linkedExhibitions: LinkedExhibition[] = []
}

export class RoomManagerReturn extends RoomCommonReturn {
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
}

export class RoomManagerWithExhibitionsReturn extends RoomManagerReturn {
  linkedExhibitions: LinkedExhibition[] = []
}

export class RoomAdminReturn extends RoomManagerReturn {
  deletedAt: Date | null = null
}

export class RoomAdminWithExhibitionsReturn extends RoomAdminReturn {
  linkedExhibitions: LinkedExhibition[] = []
}
