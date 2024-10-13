import {
  PrismaClient as PrismaBaseClient,
  Role,
  User
} from '@prisma/client/base'
import { hash } from 'bcrypt'

const prisma = new PrismaBaseClient()

class UserCommonReturn {
  id: number = 0
  username: string = ''
  picture: string = ''
  email: string = ''
  createdAt: Date = new Date()
  telNumber: string = ''
  profiles: {
    id: number
    role: string
    createdAt: Date
  }[] = []
  updatedAt: Date = new Date()
  deletedAt: Date | null = null
  uuid: string = ''
}

class ProfileCommonSelect {
  id: boolean = true
  role: boolean = true
  createdAt: boolean = true
}

class UserCommonSelect {
  id: boolean = true
  username: boolean = true
  picture: boolean = true
  email: boolean = true
  createdAt: boolean = true
  telNumber: boolean = true
  profiles: object = {
    select: new ProfileCommonSelect()
  }
  updatedAt: boolean = true
  deletedAt: boolean = true
  uuid: boolean = true
}

export async function seedUsers (): Promise<UserCommonReturn[]> {
  let users: UserCommonReturn[] = []

  users.push(
    (await prisma.user.upsert({
      where: { email: 'admin@nolosay.com' },
      update: {},
      create: {
        email: 'admin@nolosay.com',
        username: 'Admin',
        emailVerified: true,
        password: await hash('password', 12),
        telNumber: '+33600000001',
        profiles: {
          createMany: {
            data: [
              {
                role: 'USER',
                isActive: false
              },
              {
                role: 'ADMIN',
                isActive: true
              }
            ]
          }
        }
      },
      select: new UserCommonSelect()
    })) as UserCommonReturn
  )
  users.push(
    (await prisma.user.upsert({
      where: { email: 'creator@nolosay.com' },
      update: {},
      create: {
        email: 'creator@nolosay.com',
        emailVerified: true,
        username: 'Creator',
        password: await hash('password', 12),
        telNumber: '+33600000002',
        profiles: {
          createMany: {
            data: [
              {
                role: 'USER',
                isActive: false
              },
              {
                role: 'CREATOR',
                isActive: true
              }
            ]
          }
        }
      },
      select: new UserCommonSelect()
    })) as UserCommonReturn
  )
  users.push(
    (await prisma.user.upsert({
      where: { email: 'user@nolosay.com' },
      update: {},
      create: {
        email: 'user@nolosay.com',
        username: 'User',
        emailVerified: false,
        password: await hash('password', 12),
        telNumber: '+33600000003',
        profiles: {
          createMany: {
            data: [
              {
                role: 'USER',
                isActive: true
              }
            ]
          }
        }
      },
      select: new UserCommonSelect()
    })) as UserCommonReturn
  )
  users.push(
    (await prisma.user.upsert({
      where: { email: 'moderator@nolosay.com' },
      update: {},
      create: {
        email: 'moderator@nolosay.com',
        emailVerified: true,
        username: 'Moderator',
        password: await hash('password', 12),
        telNumber: '+33600000004',
        profiles: {
          createMany: {
            data: [
              {
                role: 'MODERATOR',
                isActive: true
              },
              {
                role: 'USER',
                isActive: false
              }
            ]
          }
        }
      },
      select: new UserCommonSelect()
    })) as UserCommonReturn
  )
  // Add manager for each site
  const sites = await prisma.site.findMany({})

  for (const site of sites) {
    const mainManager = (await prisma.user.upsert({
      where: { email: `mainmanager${site.id}@nolosay.com` },
      update: {},
      create: {
        email: `mainmanager${site.id}@nolosay.com`,
        emailVerified: true,
        username: `Main Manager ${site.name}`,
        password: await hash('password', 12),
        telNumber: site.telNumber ?? '+33600000005',
        profiles: {
          createMany: {
            data: [
              {
                role: 'MANAGER',
                isActive: true
              },
              {
                role: 'USER',
                isActive: false
              }
            ]
          }
        }
      },
      select: new UserCommonSelect()
    })) as UserCommonReturn

    const manager = (await prisma.user.upsert({
      where: { email: `manager${site.id}@nolosay.com` },
      update: {},
      create: {
        email: `manager${site.id}@nolosay.com`,
        emailVerified: true,
        username: `Manager ${site.name}`,
        password: await hash('password', 12),
        telNumber: '+33600000005',
        profiles: {
          createMany: {
            data: [
              {
                role: 'MANAGER',
                isActive: true
              },
              {
                role: 'USER',
                isActive: false
              }
            ]
          }
        }
      },
      select: new UserCommonSelect()
    })) as UserCommonReturn

    const mainManagerProfiles = mainManager.profiles.find(
      profile => profile.role === Role.MANAGER
    )
    if (mainManagerProfiles) {
      await prisma.siteHasManager.upsert({
        where: {
          profileId_siteId: {
            profileId: mainManagerProfiles.id,
            siteId: site.id
          }
        },
        update: {},
        create: {
          deletedAt: null,
          isMain: true,
          site: {
            connect: {
              id: site.id
            }
          },
          profile: {
            connect: {
              id: mainManagerProfiles.id
            }
          }
        }
      })
    }
    users.push(mainManager)

    const managerProfiles = mainManager.profiles.find(
      profile => profile.role === Role.MANAGER
    )
    if (managerProfiles) {
      await prisma.siteHasManager.upsert({
        where: {
          profileId_siteId: {
            profileId: managerProfiles.id,
            siteId: site.id
          }
        },
        update: {},
        create: {
          deletedAt: null,
          isMain: false,
          site: {
            connect: {
              id: site.id
            }
          },
          profile: {
            connect: {
              id: managerProfiles.id
            }
          }
        }
      })
    }
    users.push(manager)
  }

  return users
}
