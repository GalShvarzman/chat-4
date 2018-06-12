import IUser from "./user";
import User from "./user"

export interface IUsersDb {
    isUserExists(username:string):boolean,
    deleteUser(username:string):boolean,
    addUser(user:IUser):void,
    getUserNamesList():string[],
    getUser(userName:string):IUser,
    getUsers():IUser[]
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
        const user = this.users.find((user)=>{
            return user.name === userName;
        });
        if(user){
            return user;
        }
        else{
            throw new Error("No user was Found");
        }
    }

    public getUsers(){
        return this.users;
    }

}

export const usersDb: IUsersDb = new UsersDb();