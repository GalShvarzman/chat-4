import {IMessage} from "./message";

export class MessagesDb{
    private messages:{};
    constructor(){
        this.messages = {};
    }

    addMessageToGroup(message:IMessage, groupId:string){
        if(this.messages[groupId]){
            this.messages[groupId].push(message);
        }
        else{
            this.messages[groupId] = [message];
        }
    }

    addMessageUsersConversation(message:IMessage, user1Id:string, user2Id:string){
        const conversationId = this.createUniqIdForUsersConversatoin(user1Id, user2Id);

        if(this.messages[conversationId]){
            this.messages[conversationId].push(message);
        }
        else{
            this.messages[conversationId] = [message];
        }
    }

    getGroupMessages(groupId:string){
        if(this.messages[groupId]){
            return this.messages[groupId];
        }
        return [];
    }

    getUsersConversationMessages(user1Id:string, user2Id:string){
        const conversationId = this.createUniqIdForUsersConversatoin(user1Id, user2Id);
        if(this.messages[conversationId]){
            return this.messages[conversationId];
        }
        return [];
    }

    createUniqIdForUsersConversatoin(user1Id:string, user2Id:string){
        return [user1Id, user2Id].sort().join("_");
    }
}

export const messagesDb = new MessagesDb();