export class SignLanguageCommonSelect {
  uuid: boolean = true;
  name: boolean = true;
  code: boolean = true;
  color: boolean = true;
}

export class SignLanguageAdminSelect extends SignLanguageCommonSelect {
  id: boolean = true;
  createdAt: boolean = true;
  updatedAt: boolean = true;
  deletedAt: boolean = true;
}
