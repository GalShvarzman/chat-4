import * as mongoose from 'mongoose';
import {IMessageDocument, messageSchema} from './message';
import {Document} from "mongoose";

export default interface IConversationDocument extends Document {
    conversationId:string,
    messages:IMessageDocument[]
}

const conversationSchema = new mongoose.Schema({
   conversationId : String,
   messages : [messageSchema]
});

export const Conversation = mongoose.model<IConversationDocument>('Conversation', conversationSchema);