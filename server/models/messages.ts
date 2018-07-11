import {IMessage} from "./message";
import {db} from "../lib/DB";

const messagesFile = 'messages.json';

export class MessagesDb{

    async addMessageToConversation(message:IMessage, conversationId){
        // const allMessages = await db.readFile(messagesFile);
        //
        // if(allMessages.data[conversationId]){
        //     allMessages.data[conversationId].push(message);
        // }
        // else{
        //     allMessages.data[conversationId] = [message];
        // }
        // db.writeFile(allMessages, messagesFile);
        // return message;
    }

    async getConversationMessages(conversationId){

       // const allMessages = await db.readFile(messagesFile);
       // if(allMessages.data[conversationId]){
       //     return allMessages.data[conversationId]
       // }
       //
       // return [];
    }

    async getAllMessages(){
        // return await db.readFile(messagesFile);
    }

    // async updateMessagesFile(newData){
    //     await db.updateFile(newData, messagesFile);
    // }
}

export const messagesDb = new MessagesDb();