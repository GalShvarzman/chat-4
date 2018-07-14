export interface IClientUser {
    _id?:string,
    name:string,
    age?:string | number,
    password?:string
}

export interface IClientGroup {
    _id:string,
    name:string,
    children?:any
    kind?:string,
    parentId?:string
}

export interface ITree {
    id: string,
    items?: ITree[],
    name: string,
    type: string
}

