export interface IClientUser {
    name:string,
    age?:string | number,
    id?:string,
    password?:string
}

export interface IClientGroup {
    name:string,
    id:string
}

export interface ITree {
    id: string,
    items?: ITree[],
    name: string,
    type: string
}

