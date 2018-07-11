export interface IClientUser {
    id?:string,
    name:string,
    age?:string | number,
    password?:string
}

export interface IClientGroup {
    id:string,
    name:string,
    children?:IClientUser|IClientGroup[],
    parentId?:string
}

export interface ITree {
    id: string,
    items?: ITree[],
    name: string,
    type: string
}

