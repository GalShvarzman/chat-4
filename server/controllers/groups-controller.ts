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