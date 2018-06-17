import * as services from '../services'
import {Request, Response, NextFunction} from "express";

class UsersController{

    async tryCatch(next, func){
        try {
            return await func();
        }
        catch (err) {
            next(err);
        }
    }

    async saveUserDetails(req:Request, res:Response, next:NextFunction){
        return this.tryCatch(next, async ()=>{
            await services.usersService.saveUserDetails(req.body);
            res.status(201).json({message: "User details have been updated successfully"});
        });
    }

    async getAllUsers(req:Request,res:Response, next:NextFunction){
        return this.tryCatch(next, async()=>{
            res.status(200).json(await services.usersService.getAllUsers());
        })
    }

    async deleteUser(req:Request, res:Response, next:NextFunction){
        return this.tryCatch(next, async ()=>{
            return await services.usersService.deleteUser(req.body);
        })

    }

}




const usersController = new UsersController();
export default usersController;