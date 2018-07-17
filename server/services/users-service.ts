import {createHash, compareHash} from "../utils/hash";
import {ClientError} from "../utils/client-error";
import {IUser, User} from "../models/user";
import IUserDocument from "../models/user";
import {Group} from "../models/group";


class UsersService{

    async getAllUsers():Promise<IUser[]>{
        return await User.getAllUsers();
            //.find({}, {password:0, __v:0});
    }

    async saveUserDetails(userDetails:IUserDocument):Promise<{name:string, age:number, _id:string, kind:string}> {
        const newAge = userDetails.age;
        const newPassword = await createHash(userDetails.password);
        const user = await User.findOne({_id:userDetails.id});
        if (newAge) {
            user["age"] = newAge;
        }
        if (newPassword) {
            user["password"] = newPassword;
        }
        const updateUser = await user.save();

        return ({_id:updateUser._id, name:updateUser["name"], age:updateUser["age"], kind:updateUser["kind"]});
    }


    async deleteUser(id):Promise<void>{
        // fixme delete also user message history;
        await User.findByIdAndRemove(id);
        const allGroups = await Group.find({}, {__v:0, parentId:0});
        const promises = allGroups.map(async (group) => {
            if(group["children"].length > 0 && group["children"][0].kind === "User"){
                const child = group["children"].find((child) => {
                    return child.childId.toString() === id;
                });
                if(child !== undefined){
                    await Group.update({_id:group._id}, {$pull: {children: {childId: child.childId}}});
                }
            }
            return group;
        });
        await Promise.all(promises);
    }

    async createNewUser(user){
        user.password = await createHash(user.password);
        user.kind = "User";
        const newUser = await new User(user);
        await newUser.save();
        return ({_id: newUser._id, name: newUser["name"], age: newUser["age"]});
    }

    async authUser(userToAuth) {
        try {
            const userModel = await User.findOne({name:userToAuth.name}, {__v:0});
            await compareHash(userToAuth.password, userModel.password);
            return ({
                _id: userModel._id,
                name: userModel.name,
                age: userModel.age
            });
        }
        catch (e) {
            throw new ClientError(404, "authFailed");
        }
    }
}

const usersService = new UsersService();

export default usersService;