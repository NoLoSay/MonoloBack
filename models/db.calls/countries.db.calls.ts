export class CountryCommonSelect {
  id: boolean = true;
  name: boolean = true;
  code: boolean = true;
  longitude: boolean = true;
  latitude: boolean = true;
}

export class CountryAdminSelect extends CountryCommonSelect {
  createdAt: boolean = true;
  updatedAt: boolean = true;
  deletedAt: boolean = true;
}
