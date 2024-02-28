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
    houseNumber: string = ''
    street: string = ''
    zip: string = ''
    City: City = new City()
    otherDetails: string = ''
    longitude: number | null = null
    latitude: number | null = null
}

export class AddressAdminReturn extends AddressCommonReturn {
    createdAt: Date = new Date()
    updatedAt: Date = new Date()
    deletedAt: Date | null = null
}

/******* DATABASE REQUEST ******/

class CountrySelect {
    id: boolean = true
    name: boolean = true
}

class DepartmentSelect {
    id: boolean = true
    name: boolean = true
    Country: object = {
        select: new CountrySelect()
    }
}

class CitySelect {
    id: boolean = true
    name: boolean = true
    zip: boolean = true
    Department: object = {
        select: new DepartmentSelect()
    }
}

export class AddressCommonSelect {
    id: boolean = true
    houseNumber: boolean = true
    street: boolean = true
    zip: boolean = true
    City: object = {
        select: new CitySelect()
    }
    otherDetails: boolean = true
    longitude: boolean = true
    latitude: boolean = true
}

export class AddressAdminSelect extends AddressCommonSelect {
    createdAt: boolean = true
    updatedAt: boolean = true
    deletedAt: boolean = true
}
