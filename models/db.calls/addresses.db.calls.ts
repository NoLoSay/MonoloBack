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
