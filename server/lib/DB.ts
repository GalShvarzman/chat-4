import * as fs from 'fs';
import * as path from 'path';
import {createHash} from '../utils/hash';
import {ClientError} from "../utils/client-error";
import IUser from "../models/user";

class DB{
    readFile(fileName):Promise<{data:any[]}>{
        return new Promise((resolve, reject)=>{
            fs.readFile(path.join(__dirname, fileName), (err, res) => {
                if (err) reject (err);
                else{
                    resolve(JSON.parse(res.toString()));
                }
            });
        })
    }

    writeFile(data, fileName):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            fs.writeFile(path.join(__dirname, fileName), JSON.stringify(data), (err) => {
                if (err) reject (err);
                console.log('The file has been saved!');
                resolve(true);
            });
        });
    }

    async getData(fileName):Promise<{data:{name:string, age:number, id:string}[]}>{
        try{
            const result = await this.readFile(fileName);

            if(fileName === 'users.json'){
                result.data = result.data.map((user)=>{
                    return {"name":user.name, "age":user.age, "id":user.id}
                });
            }
            return result;
        }
        catch(e){
            throw new ClientError(500, "getDataFailed");
        }
    }

    async getFullData(fileName){
        try {
            return await this.readFile(fileName);
        }
        catch(e){
            throw new Error("getDataFailed");
        }
    }

    getObjIndexById(result, id) {
        const index = result.data.findIndex((obj) => {
            return obj.id === id;
        });
        if(index !== -1){
            return index;
        }
        else{
            throw new ClientError(404,"objDoesNotExist")
        }
    }

    isObjExistsByName(result, objName):boolean {
        const index = result.data.findIndex((obj) => {
            return obj.name === objName;
        });
        return (index !== -1)
    }


    async updateObjDetails(data, fileName):Promise<boolean> {
        try {
            return await this.writeFile(data, fileName);
        }
        catch(e){
            throw new ClientError(500,"updateDetailsFailed");
        }
    }

    async deleteObj(id:string, fileName):Promise<boolean> {
        try {
            const result = await this.readFile(fileName);
            const objIndex = this.getObjIndexById(result, id);
            if (objIndex !== -1) {
                result.data.splice(objIndex, 1);
                return await this.writeFile(result, fileName);
            }
        }
        catch(e){
            throw new ClientError(500,"deleteFailed");
        }
        throw new ClientError(404,"objDoesNotExist");
    }

     async createNew(obj, fileName):Promise<any> {
        try{
            const result = await this.readFile(fileName);
            result.data.push(obj);
            await this.writeFile(result, fileName);
            if(fileName === 'users.json'){
                return {user:{name:obj.name, age:obj.age, id:obj.id}}
            }
        }
        catch(e){
            throw new ClientError(500, "CreateNewFailed")
        }

    }


}

export const db = new DB();