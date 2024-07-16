class Country {
    id: number = 0
    name: string = ''
}

class Department {
    id: number = 0
    name: string = ''
    country: Country = new Country()
}

export class CityCommonReturn {
    id: number = 0
    name: string = ''
    postcode: string = ''
    department: Department = new Department()
    longitude: number = 0
    latitude: number = 0
}

export class CityAdminReturn extends CityCommonReturn {
    createdAt: Date = new Date()
    updatedAt: Date = new Date()
    deletedAt: Date | null = null
}