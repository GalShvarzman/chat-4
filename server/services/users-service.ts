import {createHash, compareHash} from "../utils/hash";
import {ClientError} from "../utils/client-error";
import {IUser, User} from "../models/user";
import IUserDocument from "../models/user";
import {Group} from "../models/group";


class UsersService{

    async getAllUsers():Promise<IUser[]>{
        return await User.find({}, {password:0, __v:0});
        // const usersList =  await users.getUsersFullData();
        // const result = usersList.data.map((user)=>{
        //     return {"name":user.name, "age":user.age, "id":user.id}
        // });
        // return {result};
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


        // const usersData = await users.getUsersFullData();
        // const userIndex = users.getUserIndexById(usersData, userDetails.id);
        // if (userDetails.age) {
        //     usersData.data[userIndex].age = userDetails.age;
        // }
        // if (userDetails.password) {
        //     usersData.data[userIndex].password =
        // }
        // await users.updateUsersFile(usersData);
        // return ({user:{name:usersData.data[userIndex].name, age:usersData.data[userIndex].age, id:usersData.data[userIndex].id}});
    }


    async deleteUser(id):Promise<void>{
        // fixme delete also user message history;
        await User.findByIdAndRemove(id);
        const allGroups = await Group.find({}, {__v:0, parentId:0});
        const promises = allGroups.map(async(group)=>{
            if(group["children"].length > 0 && group["children"][0].kind === "User"){
                const child = group["children"].find((child)=>{
                    return child.childId.toString() === id;
                });
                if(child !== undefined){
                    await Group.update({_id:group._id}, {$pull: {children: {childId: child.childId}}});
                }
            }
            return group;
        });
        await Promise.all(promises);

        // await users.onDeleteUser(id);
        // const connectorsList = await nTree.getConnectorsList();
        // connectorsList.data = connectorsList.data.filter((connector)=>{
        //     return connector.id !== id;
        // });
        // nTree.updateFile(connectorsList, 'connectors.json');
        // const allMessages = await messagesDb.getAllMessages();
        // const allMessagesKeysArr = Object.keys(allMessages.data);
        // const matchConversationKeys = [];
        //
        // allMessagesKeysArr.forEach((key)=>{
        //     if (key.includes(id)){
        //         matchConversationKeys.push(key);
        //     }
        // });
        // if(matchConversationKeys.length){
        //     matchConversationKeys.forEach((key)=>{
        //         delete allMessages.data[key];
        //     });
        //     await messagesDb.updateMessagesFile(allMessages);
        // }
    }

    async createNewUser(user){
        user.password = await createHash(user.password);
        user.kind = "User";
        const newUser = await new User(user);
        await newUser.save();
        return ({id: newUser._id, name: newUser["name"], age: newUser["age"]});

        // const usersData = await users.getUsersFullData();
        // if(await users.isUserExists(usersData, user.name)){
        //     throw new ClientError(422, "usernameAlreadyExist");
        // }
        // else{
        //     const newUser = new User(user.name, user.age, password);
        //     return await users.createNewUser(newUser);
        // }
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