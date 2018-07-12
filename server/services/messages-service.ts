import {Conversation} from "../models/conversation";
import {Message} from "../models/message";

class MessagesService{
    async getConversationMessages(conversationId){
        const messages = await Conversation.findOne({conversationId}, {__v:0, _id:0}).populate("messages.sender", {__v:0, password:0, kind:0, age:0});
        if(messages){
            return messages;
        }
        return {messages:[]};
        //return await messagesDb.getConversationMessages(conversationId);
    }
    async saveMessage(message, conversationId){
        const newMessage = await new Message({message:message.message, date:message.date, sender:message.sender.id});
        await newMessage.save();
        let conversation = await Conversation.findOne({conversationId});
        if (!conversation) {
            conversation = await new Conversation({conversationId, messages: []});
            await conversation.save();
        }
        conversation.messages.push(newMessage);
        await conversation.save();
        return newMessage;

        //return await messagesDb.addMessageToConversation(message, conversationId);
    }
}

const messagesService = new MessagesService();

export default messagesService;