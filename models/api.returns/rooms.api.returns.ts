class Exhibition {
  id: number = 0
  name: string = ''
  startDate: Date = new Date()
  endDate: Date = new Date()
}

export class RoomCommonReturn {
  id: number = 0
  name: string = ''
  description: string | undefined
}

export class RoomWithExhibitionsReturn extends RoomCommonReturn {
  exhibitions: Exhibition[] = []
}

export class RoomManagerReturn extends RoomCommonReturn {
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
}

export class RoomManagerWithExhibitionsReturn extends RoomManagerReturn {
  exhibitions: Exhibition[] = []
}

export class RoomAdminReturn extends RoomManagerReturn {
  deletedAt: Date | null = null
}
