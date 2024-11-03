import {
  ItemCommonReturn,
  ExhibitionCommonReturn,
  ExhibitionManagerReturn,
  ExhibitionAdminReturn,
} from '@noloback/api.returns';

class ExhibitedItem {
  item: ItemCommonReturn = new ItemCommonReturn();
}

export class ExhibitionCommonDetailedDbReturn extends ExhibitionCommonReturn {
  exhibitedItems: ExhibitedItem[] = [];
}

export class ExhibitionManagerDetailedDbReturn extends ExhibitionManagerReturn {
  exhibitedItems: ExhibitedItem[] = [];
}

export class ExhibitionAdminDetailedDbReturn extends ExhibitionAdminReturn {
  exhibitedItems: ExhibitedItem[] = [];
}
