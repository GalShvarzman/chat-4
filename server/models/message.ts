import * as mongoose from 'mongoose';
import {Document} from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface IMessageDocument extends Document{
    message:string,
    date?:Date,
    sender?:string,
    id?:string
}

export const messageSchema = new mongoose.Schema({
    message:String,
    date:Date,
    sender:{
        type: ObjectId,
        ref: 'User'
    }
});

export const Message = mongoose.model<IMessageDocument>('Message', messageSchema);