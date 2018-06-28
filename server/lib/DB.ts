import * as fs from 'fs';
import * as path from 'path';
import {ClientError} from "../utils/client-error";

const baseDir = path.join(__dirname.replace('dist'+path.sep,''));
class DB{
    readFile(fileName):Promise<{data:any[]}>{
        return new Promise((resolve, reject)=>{
            fs.readFile(path.join(baseDir, fileName), (err, res) => {
                if (err) reject (err);
                else{
                    resolve(JSON.parse(res.toString()));
                }
            });
        })
    }

    writeFile(data, fileName):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            fs.writeFile(path.join(baseDir, fileName), JSON.stringify(data), (err) => {
                if (err) reject (err);
                console.log('The file has been saved!');
                resolve(true);
            });
        });
    }

    async getFullData(fileName):Promise<{data:any[]}>{
        try{
            return await this.readFile(fileName);
        }
        catch(e){
            throw new ClientError(500, "getDataFailed");
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

    getObjIndex(result, obj){
        const index = result.data.findIndex((object) => {
            return (JSON.stringify(obj) === JSON.stringify(object));
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


    async updateFile(data, fileName):Promise<boolean> {
        try {
            return await this.writeFile(data, fileName);
        }
        catch(e){
            throw new ClientError(500,"updateDetailsFailed");
        }
    }

    async deleteMultipleObj(objects:{}[], fileName){
        try {
            const result = await this.readFile(fileName);

            objects.forEach(async(obj)=>{
                const objIndex = this.getObjIndex(result, obj);
                result.data.splice(objIndex, 1);
            });
            return await this.writeFile(result, fileName);
        }
        catch(e){
            throw new ClientError(500,"deleteFailed");
        }
    }


    async deleteMultipleObjById(ids:string[], fileName):Promise<boolean>{
        try {
            const result = await this.readFile(fileName);

            ids.forEach(async(id)=>{
                const objIndex = this.getObjIndexById(result, id);
                result.data.splice(objIndex, 1);
            });
            return await this.writeFile(result, fileName);
        }
        catch(e){
            throw new ClientError(500,"deleteFailed");
        }
    }


    async deleteObj(id:string, fileName):Promise<boolean> {
        try {
            const result = await this.readFile(fileName);
            const objIndex = this.getObjIndexById(result, id);

            result.data.splice(objIndex, 1);
            return await this.writeFile(result, fileName);

        }
        catch(e){
            throw new ClientError(500,"deleteFailed");
        }
    }

     async createNew(obj, fileName):Promise<any> {
        try {
            const result = await this.readFile(fileName);
            result.data.push(obj);
            await this.writeFile(result, fileName);
            if (fileName === 'users.json') {
                return {user: {name: obj.name, age: obj.age, id: obj.id}}
            }
            return obj;
        }

        catch(e){
            throw new ClientError(500, "CreateNewFailed")
        }

    }

    async createMultipleNew(data, fileName):Promise<void>{
        try{
            const result = await this.readFile(fileName);
            data.forEach((obj)=>{
                result.data.push(obj);
            });
            await this.writeFile(result, fileName);
        }
        catch (e) {
            throw new ClientError(500, "CreateNewFailed")
        }
    }

}



export const db = new DB();