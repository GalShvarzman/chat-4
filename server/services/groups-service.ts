import {Group} from "../models/group";
import {IGroup} from "../models/group";
import {User} from "../models/user";

class GroupsService{

    async getAllGroups():Promise<IGroup[]>{
        return await Group.getAllGroups();
    }

    async getGroupsWithGroupsChildren():Promise<IGroup[]>{
        return await Group.walkGroups(await Group.getRootGroup(), "checkForOptionalGroupParents");
    }

    async saveGroupDetails(groupNewDetails){
        return await Group.findByIdAndUpdate(groupNewDetails.id, {name: groupNewDetails.name}, {new: true});
    }

    async addUsersToGroup(data:{groupId:string, usersIds:string[]}){
        const users = data.usersIds.map((id)=>{
            return {kind:'User', childId:id}
        });
        return await Group.findOneAndUpdate({_id:data.groupId}, {$addToSet:{children:users}},{new:true, select:{parentId:0, __v:0}});
    }

    async createNewGroup(newGroupDetails){
        const groupParentId = newGroupDetails.parentId;
        const newGroup = await new Group({name: newGroupDetails.name, parentId: groupParentId, kind:"Group"});
        await newGroup.save();
        if (groupParentId) {
            await Group.findByIdAndUpdate(groupParentId, {
                $addToSet: {
                    children: [{
                        kind: 'Group',
                        childId: newGroup._id
                    }]
                }
            }, {new: true});
        }
        return ({_id:newGroup._id, name:newGroup.name, kind:'Group', children:newGroup.children});
    }

    async deleteGroup(groupId):Promise<void> {
        const groupToDelete = await Group.findOne({_id:groupId});
        const groupsToDelete = await Group.getGroupsToDelete(groupToDelete, "checkForGroupChildren");
        const groupsToDeleteIds = groupsToDelete.map((group)=>{
            return group._id;
        });
        await Group.deleteMany({ _id: { $in: groupsToDeleteIds } });
        await Group.findByIdAndUpdate(groupToDelete.parentId, {$pull: {children: {childId: groupToDelete._id}}});
    }

    async getGroupData(groupId) {
        return await Group.findById(groupId, {__v:0}).populate([{path:"children.childId", select:{__v:0, children:0, parentId:0, password:0}}, {path:"parentId", select:{__v:0, children:0, parentId:0}}]).lean();
    }

    async deleteUserFromGroup(groupId, userId){
        const selectedUser = await User.findOne({_id:userId});
        return await Group.findByIdAndUpdate(groupId, {$pull: {children: {childId: selectedUser._id}}});
    }

    async getGroupOptionalChildren(groupId){
        const groupData = await Group.findById(groupId, {__v:0}).populate("children.childId", {__v:0, children:0, parentId:0}).lean();
        const groupUserChildrenIds = groupData.children.map((child)=>{
            return (child.childId._id).toString();
        });
        const users = await User.find({}, {password:0, __v:0}).lean();

        return users.filter((user)=>{
            return groupUserChildrenIds.indexOf(user._id.toString()) == -1;
        });
    }
}

const groupsService = new GroupsService();

export default groupsService;