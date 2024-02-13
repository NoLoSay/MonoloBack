class User {
    id: number = 0
    username: string = ''
    picture: string = ''
}

export class VideoCommonListReturn {
    id: number = 0
    duration: number = 0
    externalProviderId: string = ''
    createdAt: Date = new Date()
    PostedBy: User = new User()
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
    PostedBy: object = {
        select: new UserSelect()
    }
}