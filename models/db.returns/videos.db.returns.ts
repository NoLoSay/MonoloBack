class User {
  id: number = 0
  username: string = ''
  picture: string | null = null
}

class UserLikeVideo {
  User: User = new User()
}

class Profile {
  user: User = new User()
}

class Item {
  id: number = 0
  uuid: string = ''
  name: string = ''
  picture: string = ''
}

export abstract class VideoDefaultDbReturn {
  id: number = 0
  uuid: string = ''
  duration: number = 0
  hostingProviderId: number = 0
  hostingProviderVideoId: string = ''
  // validationStatus: string = ''
  createdAt: Date = new Date()
  likedBy: UserLikeVideo[] = []
  item: Item | undefined = undefined
  postedBy: Profile | undefined = undefined
}

// Single video

export class VideoCommonDbReturn extends VideoDefaultDbReturn {
  constructor () {
    super()
    this.postedBy = new Profile()
    this.item = new Item()
  }
}

// ----- LISTS -----

export class VideoListedFromItemCommonDbReturn extends VideoDefaultDbReturn {
  constructor () {
    super()
    this.postedBy = new Profile()
  }
}

export class VideoListedFromUserCommonDbReturn extends VideoDefaultDbReturn {
  constructor () {
    super()
    this.item = new Item()
  }
}

// Generalize the return of a video

export class VideoManagerDbReturn extends VideoDefaultDbReturn {
  validationStatus: string = ''

  // constructor (entity?: VideoListedFromUserCommonDbReturn | VideoListedFromUserCommonDbReturn | VideoCommonDbReturn) {
  //   super()
  //   this.item = entity?.item || undefined
  //   this.postedBy = entity?.postedBy || undefined
  // }
}

export class VideoCreatorDbReturn extends VideoManagerDbReturn {
    deletedAt: Date | null = null
    deletedReason: string | null = null
}

export class VideoModeratorDbReturn extends VideoCreatorDbReturn {}

export class VideoAdminDbReturn extends VideoModeratorDbReturn {
    updatedAt: Date = new Date()
}