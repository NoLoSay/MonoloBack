class City {
    id: number = 0
    name: string = ''
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

class CitySelect {
    id: boolean = true
    name: boolean = true
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
