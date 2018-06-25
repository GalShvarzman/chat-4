import * as uuidv4 from 'uuid/v4';

export interface IMessage{
    message:string,
    date?:string,
    sender?:{name:string, id:string},
    id?:string
}

export class Message implements IMessage{
    public message:string;
    public date?:string;
    public sender?:{name:string, id:string};
    public id:string;

    constructor(message:string, date:string, sender){
        this.id = uuidv4();
        this.message = message;
        this.date = date;
        this.sender = sender;
    }
}