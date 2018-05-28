import IUser from "./user";
import User from "./user"

export interface IUsersDb {
    isUserExists(username:string):boolean,
    deleteUser(username:string):boolean,
    addUser(user:IUser):void,
    getUserNamesList():string[],
    getUser(userName:string):IUser|undefined,
    getUsers():IUser[]
}

class UsersDb implements IUsersDb{
    private users: IUser[];
    constructor(){
        this.users = [new User("gal", 27, "123")];
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
    public deleteUser(username:string){
        const i = this.findUserIndex(username);
        if(i !== -1){
            this.users.splice(i, 1);
            return true;
        }
        else{
            return false;
        }
    }
    public addUser(user:IUser){
        this.users.push(user);
    }
    public getUserNamesList(){
        return this.users.map((user)=>{
            return user.name
        })
    }
    public getUser(userName:string){
        return this.users.find((user)=>{
            return user.name === userName;
        })
    }
    public getUsers(){
        return this.users;
    }
}

export const usersDb: IUsersDb = new UsersDb();