import { AddressCommonSelect } from './addresses.db.calls';

class Picture {
  id: boolean = true;
  hostingUrl: boolean = true;
}

class Exhibition {
  id: boolean = true;
  name: boolean = true;
  shortDescription: boolean = true;
  startDate: boolean = true;
  endDate: boolean = true;
}

export class SiteCommonSelect {
  id: boolean = true;
  uuid: boolean = true;
  name: boolean = true;
  shortDescription: boolean = true;
  longDescription: boolean = true;
  telNumber: boolean = true;
  email: boolean = true;
  website: boolean = true;
  price: boolean = true;
  pictures: object = {
    select: new Picture(),
  };
  type: boolean = true;
  tags: boolean = true;
  address: object = {
    select: new AddressCommonSelect(),
  };
  exhibitions: object = {
    select: new Exhibition(),
  };
}

export class SiteManagerSelect extends SiteCommonSelect {
  siteHasManagers: boolean = true;
  createdAt: boolean = true;
}

export class SiteAdminSelect extends SiteManagerSelect {
  updatedAt: boolean = true;
  deletedAt: boolean = true;
}
