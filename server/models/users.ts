import IUser from "./user";
import User from "./user"
import {db} from '../lib/DB';
const usersFile = 'users.json';

export interface IUsersDb {
    isUserExists(data:any,username:string):boolean,
    deleteUser(username:string):Promise<boolean>,
    addUser(user:IUser):void,
    getUserNamesList():string[],
    getUser(userName:string):Promise<IUser>,
    getUsersList():Promise<{data:{name:string, age:number, id:string}[]}>,
    updateUserDetails(newData):Promise<boolean>,
    createNewUser(user):Promise<{user:{name:string, age:number, id:string}}>,
    getUserIndexById(data, id):number,
    getUsersFullData():Promise<any>
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

    public isUserExists(data, username):boolean{
        return db.isObjExistsByName(data, username);
        // const i = this.findUserIndex(username);
        // return (i !== -1);
    }

    public async deleteUser(id:string):Promise<boolean>{
        return await db.deleteObj(id, usersFile);

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
        const users:{data:any[]} = await this.getUsersList();
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

    public async getUsersList():Promise<{data:{name:string, age:number, id:string}[]}>{
        // return this.users;
        return await db.getData(usersFile);
    }

    public async updateUserDetails(newData):Promise<boolean>{
        return await db.updateObjDetails(newData, usersFile);
    }

    public getUserIndexById(data, id):number{
        return db.getObjIndexById(data, id);
    }

    public async createNewUser(user):Promise<{user:{name:string, age:number, id:string}}>{
        return await db.createNew(user, usersFile);
    }

    public async getUsersFullData():Promise<any>{
        return await db.getFullData(usersFile);
    }

}

const users: IUsersDb = new UsersDb();

export default users;