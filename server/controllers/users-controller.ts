import * as services from '../services'
import {Request, Response, NextFunction} from "express";

class UsersController{

    async saveUserDetails(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async ()=>{
            res.status(201).json(await services.usersService.saveUserDetails(req.body));
        });
    }

    async getUsers(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async()=>{
            res.status(200).json(await services.usersService.getAllUsers());
        })
    }

    async deleteUser(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async ()=>{
            await services.usersService.deleteUser(req.params.id);
            res.status(204).send("");
        })
    }

    async createNewUserOrAuth(req:Request, res:Response, next:NextFunction){
        return tryCatch(next, async ()=>{
            if(req.query.login === 'true'){
                const userAfterAuth = await services.usersService.authUser(req.body);
                res.status(200).json(userAfterAuth);
            }
            else{
                const user = await services.usersService.createNewUser(req.body);
                res.status(200).json(user);
            }
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

const usersController = new UsersController();
export default usersController;