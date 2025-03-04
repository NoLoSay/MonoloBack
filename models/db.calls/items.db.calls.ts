import { getValidationStatusFromRole } from '@noloback/video.service';
import { Role } from '@prisma/client/base';
import { VideoListedFromItemCommonSelect } from './videos.db.calls';

class PersonSelect {
  id: boolean = true;
  name: boolean = true;
}

class PictureSelect {
  id: boolean = true;
  hostingUrl: boolean = true;
}

class ItemCategorySelect {
  id: boolean = true;
  name: boolean = true;
}

class ItemTypeSelect {
  id: boolean = true;
  name: boolean = true;
  itemCategory: object = {
    select: new ItemCategorySelect(),
  };
}

class SiteSelect {
  id: boolean = true;
  name: boolean = true;
}

export class ItemCommonSelect {
  id: boolean = true;
  name: boolean = true;
  description: boolean = true;
  textToTranslate: boolean = true;
  pictures: object = {
    select: new PictureSelect(),
  };
  relatedPerson: object = {
    select: new PersonSelect(),
  };
  itemType: object = {
    select: new ItemTypeSelect(),
  };
  site: object = {
    select: new SiteSelect(),
  };
}

export class ItemDetailedSelect extends ItemCommonSelect {
  videos: object = {};

  constructor(role: Role = Role.USER) {
    super();
    this.videos = {
      select: new VideoListedFromItemCommonSelect(),
      where: {
        validationStatus: { in: getValidationStatusFromRole(role) },
      },
    };
  }
}

export class ItemManagerSelect extends ItemDetailedSelect {
  createdAt: boolean = true;
  updatedAt: boolean = true;

  constructor(role: Role = Role.MANAGER) {
    super(role);
  }
}

export class ItemAdminSelect extends ItemManagerSelect {
  deletedAt: boolean = true;
  constructor(role: Role = Role.ADMIN) {
    super(role);
  }
}
