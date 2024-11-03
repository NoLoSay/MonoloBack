import { ProfileListSelect, ProfileAdminSelect } from './profiles.db.calls';

export class UserCommonSelect {
  id: boolean = true;
  username: boolean = true;
  picture: boolean = true;
}

export class UserMeSelect extends UserCommonSelect {
  email: boolean = true;
  createdAt: boolean = true;
  telNumber: boolean = true;
  profiles: object = {
    select: new ProfileListSelect(),
  };
}

export class UserAdminSelect extends UserMeSelect {
  updatedAt: boolean = true;
  deletedAt: boolean = true;
  uuid: boolean = true;
  override profiles: object = {
    select: new ProfileAdminSelect(),
  };
}
