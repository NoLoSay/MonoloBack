class EnumColorSelect {
  id: boolean = false
  color: boolean = true
}

export class RoleColorCommonSelect extends EnumColorSelect {
  role: boolean = true
}

export class RoleColorAdminSelect extends RoleColorCommonSelect {
  override id = true
}

export class ValidationStatusColorCommonSelect extends EnumColorSelect {
  validationStatus: boolean = true
}

export class ValidationStatusColorAdminSelect extends ValidationStatusColorCommonSelect {
  override id = true
}

export class PersonTypeColorCommonSelect extends EnumColorSelect {
  personType: boolean = true
}

export class PersonTypeColorAdminSelect extends PersonTypeColorCommonSelect {
  override id = true
}

export class SiteTypeColorCommonSelect extends EnumColorSelect {
  siteType: boolean = true
}

export class SiteTypeColorAdminSelect extends SiteTypeColorCommonSelect {
  override id = true
}

export class SiteTagColorCommonSelect extends EnumColorSelect {
  siteTag: boolean = true
}

export class SiteTagColorAdminSelect extends SiteTagColorCommonSelect {
  override id = true
}
