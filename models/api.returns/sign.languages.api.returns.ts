export class SignLanguageCommonReturn {
  uuid: string = '';
  name: string = '';
  code: string = '';
  color: string = '';
}

export class SignLanguageAdminReturn extends SignLanguageCommonReturn {
  id: number = 0;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt: Date | null = null;
}
