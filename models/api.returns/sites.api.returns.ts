import { Exhibition, SiteHasManager, SiteTag, SiteType } from '@prisma/client/base'
import { AddressCommonReturn } from './addresses.api.returns'

export class SiteCommonReturn {
  id: number = 0
  uuid: string = ''
  name: string = ''
  shortDescription: string | null = null
  longDescription: string | null = null
  telNumber: string | null = null
  email: string | null = null
  website: string | null = null
  price: number = 0
  picture: string | null = null
  type: SiteTag = SiteTag.OTHER
  tags: SiteType[] = []
  address: AddressCommonReturn = new AddressCommonReturn()
  exhibition: Exhibition[] = []
}

export class SiteManagerReturn extends SiteCommonReturn {
  siteHasManagers: SiteHasManager[] = []
  createdAt: Date = new Date()
}

export class SiteAdminReturn extends SiteManagerReturn {
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
}
