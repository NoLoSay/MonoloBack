class Person {
    id: number = 0
    name: string = ''
}

class ObjectCategory {
    id: number = 0
    name: string = ''
}

class ObjectType {
    id: number = 0
    name: string = ''
    ObjectCategory: ObjectCategory = new ObjectCategory()
}

export class ObjectCommonReturn {
    id: number = 0
    name: string = ''
    description: string = ''
    picture: string = ''
    RelatedPerson: Person = new Person()
    ObjectType: ObjectType = new ObjectType()
}

export class ObjectAdminReturn extends ObjectCommonReturn {
    createdAt: Date = new Date()
    updatedAt: Date = new Date()
    deletedAt: Date | null = null
}

/******* DATABASE REQUEST ******/


class PersonSelect {
    id: boolean = true
    name: boolean = true
}

class ObjectCategorySelect {
    id: boolean = true
    name: boolean = true
}

class ObjectTypeSelect {
    id: boolean = true
    name: boolean = true
    ObjectCategory: object = {
        select: new ObjectCategorySelect()
    }
}

export class ObjectCommonSelect {
    id: boolean = true
    name: boolean = true
    description: boolean = true
    picture: boolean = true
    RelatedPerson: object = {
        select: new PersonSelect()
    }
    ObjectType: object = {
        select: new ObjectTypeSelect()
    }
}

export class ObjectAdminSelect extends ObjectCommonSelect {
    createdAt: boolean = true
    updatedAt: boolean = true
    deletedAt: boolean = true
}