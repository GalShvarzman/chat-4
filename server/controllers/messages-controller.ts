import * as services from '../services'
import {Request, Response, NextFunction} from "express";

class MessagesController{
    async getMessages(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async ()=>{
            const messages = await services.messagesService.getConversationMessages(req.params.id);
            res.status(200).json(messages);
        });
    }

    async saveMessage(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async ()=>{
            const message = await services.messagesService.saveMessage(req.body, req.params.id);
            res.status(201).json(message);
        });
    }
}

async function tryCatch(next, func){
    try {
        return await func();
    }
    catch (err) {
        next(err);
    }
}

const messagesController = new MessagesController();
export default messagesController;