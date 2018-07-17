import {create_UUID} from '../utils/uuid';
import {IClientUser} from "../interfaces";

export interface IMessage{
    message:string,
    date?:Date,
    sender?:IClientUser,
    _id?:string
}

export class Message implements IMessage{
    public message:string;
    public date?:Date;
    public sender?:IClientUser;
    public id:string;

    constructor(message:string, date:Date, sender:IClientUser){
        this.id = create_UUID();
        this.message = message;
        this.date = date;
        this.sender = sender
    }
}