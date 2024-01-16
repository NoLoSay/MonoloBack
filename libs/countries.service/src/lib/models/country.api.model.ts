export class CountryCommonReturn {
  id: number = 0
  name: string = ''
}

export class CountryAdminReturn extends CountryCommonReturn {
  longitude: number | null = null;
  latitude: number | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt: Date | null = null;
}

/******* SELECT ******/

export class CountryCommonSelect {
  id: boolean = true
  name: boolean = true
}

export class CountryAdminSelect extends CountryCommonSelect {
  longitude: boolean = true
  latitude: boolean = true
  createdAt: boolean = true
  updatedAt: boolean = true
  deletedAt: boolean = true
}