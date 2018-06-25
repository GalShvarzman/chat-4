import {db} from '../lib/DB';
const usersFile = 'users.json';

export interface IUsers {
    isUserExists(data:any,username:string):boolean,
    deleteUser(username:string):Promise<boolean>,
    // getUser(userName:string):Promise<IUser>,
    // getUsersList():Promise<{data:{name:string, age:number, id:string}[]}>,
    updateUsersFile(newData):Promise<boolean>,
    createNewUser(user):Promise<{user:{name:string, age:number, id:string}}>,
    getUserIndexById(data, id):number,
    getUsersFullData():Promise<{data:{name:string, age:number, id:string, password:string}[]}>
}

class Users implements IUsers{

    public isUserExists(data, username):boolean{
        return db.isObjExistsByName(data, username);
    }

    public async deleteUser(id:string):Promise<boolean>{
        return await db.deleteObj(id, usersFile);
    }

    // public async getUser(userName:string){
    //     const users:{data:any[]} = await this.getUsersList();
    //     const user = users.data.find((user)=>{
    //         return user.name === userName;
    //     });
    //     if(user){
    //         return user;
    //     }
    //     else{
    //         throw new Error("No user was Found");
    //     }
    // }

    // public async getUsersList():Promise<{data:{name:string, age:number, id:string}[]}>{
    //     return await db.getFullData(usersFile);
    // }

    public async updateUsersFile(newData):Promise<boolean>{
        return await db.updateFile(newData, usersFile);
    }

    public getUserIndexById(data, id):number{
        return db.getObjIndexById(data, id);
    }

    public async createNewUser(user):Promise<{user:{name:string, age:number, id:string}}>{
        return await db.createNew(user, usersFile);
    }

    public async getUsersFullData():Promise<{data:{name:string, age:number, id:string, password:string}[]}>{
        return await db.getFullData(usersFile);
    }

}

const users: IUsers = new Users();

export default users;