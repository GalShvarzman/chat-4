import {db} from '../lib/DB';
import IUser from "./user";
const usersFile = 'users.json';

export interface IUsers {
    isUserExists(data:any,username:string):boolean,
    deleteUser(username:string):Promise<boolean>,
    updateUsersFile(newData):Promise<boolean>,
    createNewUser(user):Promise<{user:IUser}>,
    getUserIndexById(data, id):number,
    getUsersFullData():Promise<{data:IUser[]}>
}

class Users implements IUsers{

    public isUserExists(data, username):boolean{
        return db.isObjExistsByName(data, username);
    }

    public async deleteUser(id:string):Promise<boolean>{
        return await db.deleteObj(id, usersFile);
    }

    public async updateUsersFile(newData):Promise<boolean>{
        return await db.updateFile(newData, usersFile);
    }

    public getUserIndexById(data, id):number{
        return db.getObjIndexById(data, id);
    }

    public async createNewUser(user):Promise<{user:IUser}>{
        return await db.createNew(user, usersFile);
    }

    public async getUsersFullData():Promise<{data:IUser[]}>{
        return await db.getFullData(usersFile);
    }

}

const users: IUsers = new Users();

export default users;