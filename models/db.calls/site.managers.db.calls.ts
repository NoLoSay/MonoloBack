class SiteManagerUserSelect {
  id: boolean = true;
  username: boolean = true;
  email: boolean = true;
}

class SiteManagerProfileSelect {
  id: boolean = true;
  user: object = {
    select: new SiteManagerUserSelect(),
  };
}

export class SiteManagerCommonSelect {
  profile: object = {
    select: new SiteManagerProfileSelect(),
  };
  isMain: boolean = true;
  createdAt: boolean = true;
}
