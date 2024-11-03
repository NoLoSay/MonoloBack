import { PersonType } from '@noloback/prisma-client-base';
import e = require('express');

class EnumColor {
  color: string = '';
}

export class RoleColorCommonReturn extends EnumColor {
  role: string = '';
}

export class RoleColorAdminReturn extends RoleColorCommonReturn {
  id: number = 0;
}

export class ValidationStatusColorCommonReturn extends EnumColor {
  validationStatus: string = '';
}

export class ValidationStatusColorAdminReturn extends ValidationStatusColorCommonReturn {
  id: number = 0;
}

export class PersonTypeColorCommonReturn extends EnumColor {
  personType: string = '';
}

export class PersonTypeColorAdminReturn extends PersonTypeColorCommonReturn {
  id: number = 0;
}

export class SiteTypeColorCommonReturn extends EnumColor {
  siteType: string = '';
}

export class SiteTypeColorAdminReturn extends SiteTypeColorCommonReturn {
  id: number = 0;
}

export class SiteTagColorCommonReturn extends EnumColor {
  siteTag: string = '';
}

export class SiteTagColorAdminReturn extends SiteTagColorCommonReturn {
  id: number = 0;
}
