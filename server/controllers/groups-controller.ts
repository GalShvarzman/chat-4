import * as services from '../services'
import {Request, Response, NextFunction} from "express";

class GroupsController{

    async getAllGroups(req:Request,res:Response, next:NextFunction){
        return tryCatch(next, async()=>{
            res.status(200).json(await services.groupService.getAllGroups());
        })
    }

    async getGroupData(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async()=>{
            res.status(200).json(await services.groupService.getGroupData(req.params.id));
        })
    }

    async deleteGroup(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async () => {
            await services.groupService.deleteGroup(req.params.id);
            res.status(204).send("");
        });
    }

    async createNewGroup(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async () => {
            const group = await services.groupService.createNewGroup(req.body);
            res.status(200).json(group)
        })
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

const groupsController = new GroupsController();
export default groupsController;