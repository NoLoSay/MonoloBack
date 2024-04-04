class Country {
    id: number = 0
    name: string = ''
}

class Department {
    id: number = 0
    name: string = ''
    Country: Country = new Country()
}

class City {
    id: number = 0
    name: string = ''
    zip: string = ''
    Department: Department = new Department()
}

export class AddressCommonReturn {
    id: number = 0
    houseNumber: string | null = null
    street: string = ''
    zip: string = ''
    City: City = new City()
    otherDetails: string | null = null
    longitude: number | null = null
    latitude: number | null = null
}

export class AddressAdminReturn extends AddressCommonReturn {
    createdAt: Date = new Date()
    updatedAt: Date = new Date()
    deletedAt: Date | null = null
}