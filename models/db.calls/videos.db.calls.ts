class UserVideoSelect {
  id: boolean = true
  username: boolean = true
  picture: boolean = true
}

class ItemVideoSelect {
  id: boolean = true
  uuid: boolean = true
  name: boolean = true
  description: boolean = true
  pictures: boolean = true
}

class ProfileVideoSelect {
  user: object = {
    select: new UserVideoSelect()
  }
}

abstract class VideoDefaultSelect {
  id: boolean = true
  uuid: boolean = true
  duration: boolean = true
  hostingProviderId: boolean = true
  hostingProviderVideoId: boolean = true
  validationStatus: boolean = true
  createdAt: boolean = true
  likedBy: object = {
    select: {
      User: {
        select: new UserVideoSelect()
      }
    }
  }
  item: object | undefined = undefined
  postedBy: object | undefined = undefined
}

// Single video

export class VideoCommonSelect extends VideoDefaultSelect {
  constructor () {
    super()
    this.postedBy = {
      select: new ProfileVideoSelect()
    }
    this.item = {
      select: new ItemVideoSelect()
    }
  }
}

// ----- LISTS -----

export class VideoListedFromItemCommonSelect extends VideoDefaultSelect {
  constructor () {
    super()
    this.postedBy = {
      select: new ProfileVideoSelect()
    }
  }
}

export class VideoListedFromUserCommonSelect extends VideoDefaultSelect {
  constructor () {
    super()
    this.item = {
      select: new ItemVideoSelect()
    }
  }
}

// Generalize the return of a video

export class VideoManagerSelect extends VideoDefaultSelect {
  validationStatus: boolean = true

  constructor (entity: VideoDefaultSelect) {
    super()
    this.item = entity.item
    this.postedBy = entity.postedBy
  }
}

export class VideoCreatorSelect extends VideoManagerSelect {
  deletedAt: boolean = true
  deletedReason: boolean = true
}

export class VideoModeratorSelect extends VideoCreatorSelect {}

export class VideoAdminSelect extends VideoModeratorSelect {
  updatedAt: boolean = true
}
