import {IMessage, Message} from "./message";
import {db} from "../lib/DB";

export class MessagesDb{
    private messages:{};
    constructor(){
        this.messages = {};
    }

    // addMessageToGroup(message:IMessage, groupId:string){
    //     if(this.messages[groupId]){
    //         this.messages[groupId].push(message);
    //     }
    //     else{
    //         this.messages[groupId] = [message];
    //     }
    // }

    async addMessageToConversation(message:IMessage, conversationId){
        const allMessages = await db.readFile('messages.json');

        if(allMessages.data[conversationId]){
            allMessages.data[conversationId].push(message);
        }
        else{
            allMessages.data[conversationId] = [message];
        }
        db.writeFile(allMessages, 'messages.json');
        return message;
    }

    async getConversationMessages(conversationId){
       const allMessages = await db.readFile('messages.json');
       if(allMessages.data[conversationId]){
           return allMessages.data[conversationId]
       }

       return [];
    }

    // getGroupMessages(groupId:string){
    //     if(this.messages[groupId]){
    //         return this.messages[groupId];
    //     }
    //     return [];
    // }

    // getUsersConversationMessages(user1Id:string, user2Id:string){
    //     const conversationId = this.createUniqIdForUsersConversatuin(user1Id, user2Id);
    //     if(this.messages[conversationId]){
    //         return this.messages[conversationId];
    //     }
    //     return [];
    // }

    // createUniqIdForUsersConversatuin(user1Id:string, user2Id:string){
    //     return [user1Id, user2Id].sort().join("_");
    // }
}

export const messagesDb = new MessagesDb();