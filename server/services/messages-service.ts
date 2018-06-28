import {messagesDb} from '../models/messages';

class MessagesService{
    async getConversationMessages(conversationId){
        return await messagesDb.getConversationMessages(conversationId);
    }
    async saveMessage(message, conversationId){
        return await messagesDb.addMessageToConversation(message, conversationId);
    }
}

const messagesService = new MessagesService();

export default messagesService;