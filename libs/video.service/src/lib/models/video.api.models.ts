class User {
    id: number = 0
    username: string = ''
    picture: string = ''
}

class Item {
    id: number = 0
    name: string = ''
    picture: string = ''
}

export class VideoCommonListReturn {
    id: number = 0
    uuid: string = ''
    duration: number = 0
    externalProviderId: string = ''
    validationStatus: string = ''
    createdAt: Date = new Date()
    PostedBy: User = new User()
    Item: Item = new Item()
}

export class VideoItemListReturn {
    videoList: VideoCommonListReturn[] = []
    linkedItems: Item[] = []
}

export class VideoItemReturn {
    video: VideoCommonListReturn = new VideoCommonListReturn()
    url: string = ''
}

/******* DATABASE REQUEST ******/

class UserSelect {
    id: boolean = true
    username: boolean = true
    picture: boolean = true
}

class ItemSelect {
    id: boolean = true
    name: boolean = true
    picture: boolean = true
}

export class VideoCommonListSelect {
    id: boolean = true
    uuid: boolean = true
    duration: boolean = true
    externalProviderId: boolean = true
    createdAt: boolean = true
    validationStatus: boolean = true
    PostedBy: object = {
        select: new UserSelect()
    }
    Item: object = {
        select: new ItemSelect()
    }
}