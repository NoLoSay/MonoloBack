class User {
    id: number = 0
    username: string = ''
    picture: string|null = null
}

class UserLikeVideo {
    User: User = new User()
}

export class VideoCommonListEntity {
    id: number = 0
    duration: number = 0
    externalProviderId: string = ''
    validationStatus: string = ''
    createdAt: Date = new Date()
    PostedBy: User = new User()
    LikedBy: UserLikeVideo[] = []
}

export class VideoCommonListReturn {
    id: number = 0
    duration: number = 0
    externalProviderId: string = ''
    validationStatus: string = ''
    createdAt: Date = new Date()
    PostedBy: User = new User()
    LikedBy: User[] = []

    constructor (entity: VideoCommonListEntity) {
        this.id = entity.id
        this.duration = entity.duration
        this.externalProviderId = entity.externalProviderId
        this.validationStatus = entity.validationStatus
        this.createdAt = entity.createdAt
        this.PostedBy = entity.PostedBy
        this.LikedBy = entity.LikedBy.map((user) => user.User)
    }
}


/******* DATABASE REQUEST ******/

class UserSelect {
    id: boolean = true
    username: boolean = true
    picture: boolean = true
}

export class VideoCommonListSelect {
    id: boolean = true
    duration: boolean = true
    externalProviderId: boolean = true
    createdAt: boolean = true
    validationStatus: boolean = true
    PostedBy: object = {
        select: new UserSelect()
    }
    LikedBy: object = {
        select: {
            User: {
                select: new UserSelect()
            }
        }
    }
}