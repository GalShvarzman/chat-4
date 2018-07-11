import {Conversation} from "../models/conversation";
import {Message} from "../models/message";

class MessagesService{
    async getConversationMessages(conversationId){
        return await Conversation.findOne({conversationId})

        //return await messagesDb.getConversationMessages(conversationId);
    }
    async saveMessage(message, conversationId){
        const newMessage = await new Message({message:message.message, date:message.date, sender:message.sender._id});
        await newMessage.save();
        let conversation = await Conversation.findOne({conversationId});
        if (!conversation) {
            conversation = await new Conversation({conversationId, messages: []});
            await conversation.save();
        }
        conversation.messages.push(newMessage._id);
        await conversation.save();
        return newMessage;

        //return await messagesDb.addMessageToConversation(message, conversationId);
    }
}

const messagesService = new MessagesService();

export default messagesService;