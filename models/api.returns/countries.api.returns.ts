export class CountryCommonReturn {
  id: number = 0
  name: string = ''
  code: string = ''
  longitude: number | null = null;
  latitude: number | null = null;
}

export class CountryAdminReturn extends CountryCommonReturn {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt: Date | null = null;
}