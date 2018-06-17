import users from '../models/users';

class UsersService{

    async getAllUsers():Promise<{data:{name:string, age:number, id:string}[]}>{
        return await users.getUsers();
    }

    async saveUserDetails(userDetails):Promise<boolean>{
        return await users.updateUserDetails(userDetails);
    }

    async deleteUser(user):Promise<boolean>{
        return await users.deleteUser(user.name);
    }

}

const usersService = new UsersService();

export default usersService;