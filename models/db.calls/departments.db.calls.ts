class CountrySelect {
  id: boolean = true;
  name: boolean = true;
  code: boolean = true;
}

export class DepartmentCommonSelect {
  id: boolean = true;
  name: boolean = true;
  code: boolean = true;
  longitude: boolean = true;
  latitude: boolean = true;
  country: object = {
    select: new CountrySelect(),
  };
}

export class DepartmentAdminSelect extends DepartmentCommonSelect {
  createdAt: boolean = true;
  updatedAt: boolean = true;
  deletedAt: boolean = true;
}
