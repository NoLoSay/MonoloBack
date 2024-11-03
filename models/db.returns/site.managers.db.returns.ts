class SiteManagerUserDbReturn {
  id: number = 0;
  email: string = '';
  username: string = '';
}

class SiteManagerProfileDbReturn {
  user: SiteManagerUserDbReturn = new SiteManagerUserDbReturn();
}

export class SiteManagerCommonDbReturn {
  profile: SiteManagerProfileDbReturn = new SiteManagerProfileDbReturn();
  createdAt: Date = new Date();
  isMain: boolean = false;
}
