import {create_UUID} from '../utils/uuid';

export interface IMessage{
    message:string,
    date?:Date,
    sender?:{name:string, id:string},
    id?:string
}

export class Message implements IMessage{
    public message:string;
    public date?:Date;
    public sender?:{name:string, id:string};
    public id:string;

    constructor(message:string, date:Date, sender:{name:string, id:string}){
        this.id = create_UUID();
        this.message = message;
        this.date = date;
        this.sender = sender
    }
}