import {
  ExhibitionAdminDetailedDbReturn,
  ExhibitionCommonDetailedDbReturn,
  ExhibitionManagerDetailedDbReturn,
} from '@noloback/db.returns';
import { ItemCommonReturn } from './items.api.returns';
import { SiteCommonReturn } from './sites.api.returns';

export class ExhibitionCommonReturn {
  id: number = 0;
  name: string = '';
  shortDescription: string = '';
  longDescription: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  site: SiteCommonReturn = new SiteCommonReturn();
}

export class ExhibitionCommonDetailedReturn extends ExhibitionCommonReturn {
  items: ItemCommonReturn[] = [];

  constructor(data: ExhibitionCommonDetailedDbReturn) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.shortDescription = data.shortDescription;
    this.longDescription = data.longDescription;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.site = data.site;
    this.items = data.exhibitedItems.map((exhibitedItem) => {
      return exhibitedItem.item;
    });
  }
}

export class ExhibitionManagerReturn extends ExhibitionCommonReturn {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

export class ExhibitionManagerDetailedReturn extends ExhibitionManagerReturn {
  items: ItemCommonReturn[] = [];
  constructor(data: ExhibitionManagerDetailedDbReturn) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.shortDescription = data.shortDescription;
    this.longDescription = data.longDescription;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.site = data.site;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.items = data.exhibitedItems.map((exhibitedItem) => {
      return exhibitedItem.item;
    });
  }
}

export class ExhibitionAdminReturn extends ExhibitionManagerReturn {
  deletedAt: Date | null = null;
}

export class ExhibitionAdminDetailedReturn extends ExhibitionAdminReturn {
  items: ItemCommonReturn[] = [];
  constructor(data: ExhibitionAdminDetailedDbReturn) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.shortDescription = data.shortDescription;
    this.longDescription = data.longDescription;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.site = data.site;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
    this.items = data.exhibitedItems.map((exhibitedItem) => {
      return exhibitedItem.item;
    });
  }
}
