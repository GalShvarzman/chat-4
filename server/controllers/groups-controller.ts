import * as services from '../services'
import {Request, Response, NextFunction} from "express";

class GroupsController{

    async getGroups(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async()=>{
            if(req.query['groups_with_children']=='true'){
                res.status(200).json(await services.groupService.getGroupsWithGroupsChildren());
            }
            else{
                res.status(200).json(await services.groupService.getAllGroups());
            }
        })
    }

    async getGroupData(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async()=>{
            if(req.query['optional_users'] == 'true'){
                res.status(200).json(await services.groupService.getGroupOptionalChildren(req.params.id));
            }
            else{
                res.status(200).json(await services.groupService.getGroupData(req.params.id));
            }
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

    async addUsersToGroup(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async () => {
            const addedGroups = await services.groupService.addUsersToGroup(req.body);
            res.status(200).json(addedGroups);
        })
    }

    async saveGroupDetails(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async () => {
           const updatedGroup = await services.groupService.saveGroupDetails(req.body);
            res.status(201).json(updatedGroup);
        })
    }

    async deleteUserFromGroup(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async () => {
            await services.groupService.deleteUserFromGroup(req.params.id, req.params.userid);
            res.status(204).send("");
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