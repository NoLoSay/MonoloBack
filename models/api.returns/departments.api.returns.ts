class Country {
    id: number = 0
    name: string = ''
    code: string = ''
}

export class DepartmentCommonReturn {
  id: number = 0
  name: string = ''
  code: string = ''
  longitude: number | null = null
  latitude: number | null = null
  country: Country = new Country()
}

export class DepartmentAdminReturn extends DepartmentCommonReturn {
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
}
