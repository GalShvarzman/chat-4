import {messagesDb} from '../models/messages';

class MessagesService{
    async getConversationMessages(conversationId){
        return await messagesDb.getConversationMessages(conversationId);
    }
}


const messagesService = new MessagesService();

export default messagesService;