class CountrySelect {
    id: boolean = true
    name: boolean = true
}

class DepartmentSelect {
    id: boolean = true
    name: boolean = true
    country: object = {
        select: new CountrySelect()
    }
}

export class CityCommonSelect {
    id: boolean = true
    name: boolean = true
    postcode: boolean = true
    department: object = {
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