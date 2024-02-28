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

export class CityCommonSelect {
    id: boolean = true
    name: boolean = true
    zip: boolean = true
    Department: object = {
        select: new DepartmentSelect()
    }
    longitude: boolean = true
    latitude: boolean = true
}

export class CityAdminSelect extends CityCommonSelect {
    createdAt: boolean = true
    updatedAt: boolean = true
    deletedAt: boolean = true
}