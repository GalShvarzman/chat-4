import users from '../models/users';
import {createHash} from "../utils/hash";
import {ClientError} from "../utils/client-error";
import * as uuidv4 from 'uuid/v4';


class UsersService{

    async getAllUsers():Promise<{data:{name:string, age:number, id:string}[]}>{
        return await users.getUsersList();
    }

    async saveUserDetails(userDetails:{name:string, age?:number, id:string, password?:string}):Promise<boolean>{
        const usersData = await users.getUsersFullData();
        const userIndex = users.getUserIndexById(usersData, userDetails.id);
        if (userDetails.age) {
            usersData.data[userIndex].age = userDetails.age;
        }
        if (userDetails.password) {
            usersData.data[userIndex].password = await createHash(userDetails.password); // fixme
        }
        return await users.updateUserDetails(usersData);
    }

    async deleteUser(id):Promise<boolean>{
        return await users.deleteUser(id);
    }

    async createNewUser(user):Promise<{user:{name:string, age:number, id:string}}>{
        const usersData = await users.getUsersList();
        if(await users.isUserExists(usersData, user.name)){
            throw new ClientError(400, "usernameAlreadyExist") // fixme status??
        }
        else{
            user.password = await createHash(user.password);
            user.id = uuidv4();
            return await users.createNewUser(user);
        }
    }

}

const usersService = new UsersService();

export default usersService;