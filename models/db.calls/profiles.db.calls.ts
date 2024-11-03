import { UserEmailReturn } from '@noloback/api.returns';

export class ProfileCommonSelect {
  id: boolean = true;
  role: boolean = true;
  createdAt: boolean = true;
}

export class ProfileListSelect extends ProfileCommonSelect {
  isActive: boolean = true;
}

export class ProfileAdminSelect extends ProfileListSelect {
  updatedAt: boolean = true;
  deletedAt: boolean = true;
}

export class ProfileUserAdminSelect extends ProfileAdminSelect {
  userId: boolean = true;
  user: boolean = true;
}
