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
    uuid: string = ''
    duration: number = 0
    externalProviderId: string = ''
    validationStatus: string = ''
    createdAt: Date = new Date()
    postedBy: User = new User()
    likedBy: UserLikeVideo[] = []
    item: Item = new Item()
}

class Item {
    id: number = 0
    uuid: string = ''
    name: string = ''
    description: string = ''
    picture: string = ''
}

export class VideoCommonListReturn {
    id: number = 0
    uuid: string = ''
    duration: number = 0
    externalProviderId: string = ''
    validationStatus: string = ''
    createdAt: Date = new Date()
    postedBy: User = new User()
    likedBy: User[] = []
    item: Item = new Item()

    constructor (entity?: VideoCommonListEntity) {
        this.id = entity?.id || 0
        this.uuid = entity?.uuid || ''
        this.duration = entity?.duration || 0
        this.externalProviderId = entity?.externalProviderId || ''
        this.validationStatus = entity?.validationStatus || ''
        this.createdAt = entity?.createdAt || new Date()
        this.postedBy = entity?.postedBy || new User()
        this.likedBy = entity?.likedBy.map((user) => user.User) || []
        this.item = entity?.item || new Item()
    }
}


/******* DATABASE REQUEST ******/

class UserSelect {
    id: boolean = true
    username: boolean = true
    picture: boolean = true
}

class ItemSelect {
    id: boolean = true
    uuid: boolean = true
    name: boolean = true
    description: boolean = true
    picture: boolean = true
}

export class VideoCommonListSelect {
    id: boolean = true
    uuid: boolean = true
    duration: boolean = true
    externalProviderId: boolean = true
    createdAt: boolean = true
    validationStatus: boolean = true
    postedBy: object = {
        select: new UserSelect()
    }
    item: object = {
        select: new ItemSelect()
    }
    likedBy: object = {
        select: {
            User: {
                select: new UserSelect()
            }
        }
    }
}