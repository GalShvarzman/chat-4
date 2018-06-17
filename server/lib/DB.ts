import * as fs from 'fs';
import * as path from 'path';
import {createHash} from '../utils/hash';
const usersFile = 'users.json';
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

    async getUsersList():Promise<{data:{name:string, age:number, id:string}[]}>{
        const result = await this.readFile(usersFile);

        result.data = result.data.map((user)=>{
            return {"name":user.name, "age":user.age, "id":user.id}
        });

        return result;
    }

    async getUsers():Promise<{data:{name:string, age:number, id:string, password:string}[]}>{
        return await this.readFile(usersFile);
    }

    getUserIndexByName(result, userName){
        const userIndex = result.data.findIndex((user) => {
            return user.name === userName;
        });

        if(userIndex !== -1){
            return userIndex
        }
        else{
            return;
        }
    }

    async updateUserDetails(userNewDetails):Promise<boolean> {
        const result = await this.getUsers();
        let userIndex = this.getUserIndexByName(result,userNewDetails.name);
        if(userIndex){
            if(userNewDetails.age){
                result.data[userIndex].age = userNewDetails.age;
            }
            if(userNewDetails.password){
                result.data[userIndex].password  = await createHash(userNewDetails.password);
            }
            return await this.writeFile(result, usersFile);
        }
    }

    async deleteUser(username:string):Promise<boolean> {
        const result = await this.readFile(usersFile);
        const userIndex = this.getUserIndexByName(result, username);
        if (userIndex) {
            try{
                result.data.splice(userIndex, 1);
                return await this.writeFile(result, usersFile);
            }
            catch (e) {
                // fixme;
                return false;
            }
        }
    }

}

export const db = new DB();