export class CountryCommonReturn {
  id: number = 0
  name: string = ''
  longitude: number | null = null;
  latitude: number | null = null;
}

export class CountryAdminReturn extends CountryCommonReturn {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt: Date | null = null;
}

/******* SELECT ******/

export class CountryCommonSelect {
  id: boolean = true
  name: boolean = true
  longitude: boolean = true
  latitude: boolean = true
}

export class CountryAdminSelect extends CountryCommonSelect {
  createdAt: boolean = true
  updatedAt: boolean = true
  deletedAt: boolean = true
}