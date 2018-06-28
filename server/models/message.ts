export interface IMessage{
    message:string,
    date?:string,
    sender?:{name:string, id:string},
    id?:string
}