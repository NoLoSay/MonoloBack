class Country {
    id: number = 0
    name: string = ''
}

class Department {
    id: number = 0
    name: string = ''
    Country: Country = new Country()
}

export class CityCommonReturn {
    id: number = 0
    name: string = ''
    zip: string = ''
    Department: Department = new Department()
    longitude: number = 0
    latitude: number = 0
}

export class CityAdminReturn extends CityCommonReturn {
    createdAt: Date = new Date()
    updatedAt: Date = new Date()
    deletedAt: Date | null = null
}