import { SiteHasManager, SiteTag, SiteType } from '@prisma/client/base';
import { AddressCommonReturn } from './addresses.api.returns';
import { ProfileUserAdminReturn } from './profiles.api.returns';

class Picture {
  id: number = 0;
  uuid: string = '';
  hostingUrl: string = '';
}

class Exhibition {
  id: number = 0;
  name: string = '';
  shortDescription: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
}

export class SiteCommonReturn {
  id: number = 0;
  uuid: string = '';
  name: string = '';
  shortDescription: string | null = null;
  longDescription: string | null = null;
  telNumber: string | null = null;
  email: string | null = null;
  website: string | null = null;
  price: number = 0;
  pictures: Picture[] | null = null;
  type: SiteTag = SiteTag.OTHER;
  tags: SiteType[] = [];
  address: AddressCommonReturn = new AddressCommonReturn();
  exhibitions: Exhibition[] = [];
}

export class SiteHasManagerAdminReturn {
  id: number = 0;
  isMain: boolean = false;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt: Date | null = null;
  siteId: number = 0;
  profileId: number = 0;
  profile: ProfileUserAdminReturn = new ProfileUserAdminReturn();
}

export class SiteManagerReturn extends SiteCommonReturn {
  siteHasManagers: SiteHasManager[] = [];
  createdAt: Date = new Date();
}

export class SiteAdminReturn extends SiteManagerReturn {
  override siteHasManagers: SiteHasManagerAdminReturn[] = [];
  updatedAt: Date = new Date();
  deletedAt: Date | null = null;
}
