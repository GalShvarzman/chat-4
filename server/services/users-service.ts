import users from '../models/users';

class UsersService{

    static async getAllUsers():Promise<{data:{name:string, age:number, id:string}[]}>{
        return await users.getUsers();
    }

    static async saveUserDetails(userDetails):Promise<boolean>{
        return await users.updateUserDetails(userDetails);
    }

    static async deleteUser(user):Promise<boolean>{
        return await users.deleteUser(user.name);
    }

}

const usersService = new UsersService();

export default usersService;