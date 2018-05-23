import IUser from "./user";

export default class UsersDb{
    public users: IUser[];
    constructor(){
        this.users = [];
    }

    public findUserIndex(username:string){
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
}