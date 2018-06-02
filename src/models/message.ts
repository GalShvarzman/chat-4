function create_UUID(){
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export interface IMessage{
    message:string,
    date?:string,
    sender?:string|null,
    id?:string
}

export class Message implements IMessage{
    public message:string;
    public date?:string;
    public sender?:string;
    public id:string;

    constructor(message:string, date:string){
        this.id = create_UUID();
        this.message = message;
        this.date = date;
    }
}