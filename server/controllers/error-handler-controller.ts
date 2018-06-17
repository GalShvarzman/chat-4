import {Request, Response, NextFunction} from "express";
import {ClientError} from "../utils/client-error";

class ErrorHandlerController {

     errorHandler(err:Error, req:Request, res:Response, next:NextFunction) {
         if (res.headersSent) {
            return next(err);
         }
         if(err instanceof ClientError){
             res.status(err.status).json({message:err.message});
         }
         else{
             res.status(500).json({message:"Something went wrong..."})
         }
     }
 }

const errorHandlerController = new ErrorHandlerController();
 export default errorHandlerController;