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