import IUser from "./user";
import User from "./user"
import {db} from '../lib/DB';

export interface IUsersDb {
    isUserExists(username:string):boolean,
    deleteUser(username:string):Promise<boolean>,
    addUser(user:IUser):void,
    getUserNamesList():string[],
    getUser(userName:string):Promise<IUser>,
    getUsers():Promise<{data:{name:string, age:number, id:string}[]}>,
    updateUserDetails(user:IUser):Promise<boolean>
}

class UsersDb implements IUsersDb{
    private users: IUser[];
    constructor(){
        this.users = [new User("gal", 27, "123"), new User("Tommy", 24, "123"), new User("Ori", 30, "123"), new User("Udi", 34, "123"), new User("Roni", 5, "123")];
    }

    private findUserIndex(username:string){
        return this.users.findIndex((user)=>{
            return username === user.name;
        })
    }

    public isUserExists(username:string){
        const i = this.findUserIndex(username);
        return (i !== -1);
    }

    public async deleteUser(username:string):Promise<boolean>{
        return await db.deleteUser(username);

        // const i = this.findUserIndex(username);
        // if(i !== -1){
        //     this.users.splice(i, 1);
        //     return true;
        // }
        // else{
        //     return false;
        // }
    }

    public addUser(user:IUser){
        this.users.push(user);
    }
    public getUserNamesList(){
        return this.users.map((user)=>{
            return user.name
        })
    }

    public async getUser(userName:string){
        const users:{data:any[]} = await this.getUsers();
        const user = users.data.find((user)=>{
            return user.name === userName;
        });
        if(user){
            return user;
        }
        else{
            throw new Error("No user was Found");
        }
    }

    public async getUsers():Promise<{data:{name:string, age:number, id:string}[]}>{
        // return this.users;
        return await db.getUsersList();
    }

    public async updateUserDetails(userNewDetails):Promise<boolean>{
        return await db.updateUserDetails(userNewDetails);
    }

}

const users: IUsersDb = new UsersDb();

export default users;