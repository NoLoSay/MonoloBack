import { SiteTag, SiteType } from '@prisma/client/base'
import { AddressCommonReturn } from './addresses.api.returns'

export class SiteCommonReturn {
  id: number = 0
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
}

export class SiteManagerReturn extends SiteCommonReturn {
  createdAt: Date = new Date()
}

export class SiteAdminReturn extends SiteManagerReturn {
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
}
