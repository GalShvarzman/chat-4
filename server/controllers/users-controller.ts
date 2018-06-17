import * as services from '../services'
import {Request, Response} from "express";

class UsersController{

    static async saveUserDetails(req:Request, res:Response){
        try {
            await services.usersService.saveUserDetails(req.body);
            res.status(200).json({message: "User details have been updated successfully"});
        }
        catch (e) {
            res.status(500).json({message:"There was a problem, try again"});
        }
    }

    static async getAllUsers(req:Request,res:Response){
        const data = await services.usersService.getAllUsers();
        res.status(200).json(data);
    }

    async deleteUser(req:Request, res:Response){
        return await services.usersService.deleteUser(req.body);
    }

}




const usersController = new UsersController();
export default usersController;