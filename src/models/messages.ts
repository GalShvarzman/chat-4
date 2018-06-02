import {IMessage} from "../components/chat";

class MessagesDb{
    private messages : {};
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
        const conversationId = this.createUniqIdForUsersConversatuin(user1Id, user2Id);

        if(this.messages[conversationId]){
            this.messages[conversationId].push(message);
        }
        else{
            this.messages[conversationId] = [message];
        }
    }

    getGroupMessages(groupId:string){
        return this.messages[groupId];
    }

    getUsersConversationMessages(user1Id:string, user2Id:string){
        const conversationId = this.createUniqIdForUsersConversatuin(user1Id, user2Id);
        return this.messages[conversationId];
    }

    createUniqIdForUsersConversatuin(user1Id:string, user2Id:string){
        return [user1Id, user2Id].sort().join("_");
    }
}

export const messagedDb = new MessagesDb();