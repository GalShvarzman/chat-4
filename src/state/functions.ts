import {IState} from "./store";
import {IClientGroup, IClientUser} from "../interfaces";

export function setGroups(state:IState, action:any){
    return{
        ...state,
        groups:action.groups
    }
}

export function setUsers(state:IState, action:any){
    return{
        ...state,
        users:action.users
    }
}

export function setSelectedMessages(state:IState, action:any){
    return{
        ...state,
        selectedMessages:action.messages
    }
}

export function updateUsersAfterEditUserDetails(state:IState, action:any){
    const usersClone = [...state.users];
    const userIndex = usersClone.findIndex((user) => {
        return user._id === action.user._id;
    });
    usersClone[userIndex] = action.user;

    return{
        ...state,
        users : usersClone
    }
}

export function updateGroupsAfterEditGroup(state:IState, action:any){
    const groupsClone = [...state.groups];
    const groupIndex = groupsClone.findIndex((group) => {
        return group._id === action.group._id;
    });
    groupsClone[groupIndex] = action.group;
    return{
        ...state,
        groups : groupsClone,
        updatedGroup:action.group
    }
}

export function setUpdateErrorMsg(state:IState, action:any){
    return{
        ...state,
        errorMsg:action.errorMsg
    }
}

export function setLoggedInUser(state:IState, action:any){
    return {
        ...state,
        loggedInUser:action.loggedInUser
    }
}

export function setGroupOptionalParents(state:IState, action:any){
    return {
        ...state,
        groupsWithGroupsChildren : action.groupOptionalParents
    }
}

export function setGroupsAfterCreateNewGroup(state:IState, action:any){
    const newGroup = action.newGroup;
    const groupParentId = action.parent;
    const groupsClone = [...state.groups];
    const groupParentIndex = groupsClone.findIndex((group) => {
        return group._id === groupParentId;
    });
    if(groupParentIndex !== -1){
        groupsClone[groupParentIndex].children.push(newGroup);
    }

    return{
        ...state,
        groups:groupsClone.concat([newGroup]),
        groupsWithGroupsChildren:state.groupsWithGroupsChildren.concat([newGroup])
    }
}

function walkGroups(selectedGroup:IClientGroup){
    const groupsToDelete = [selectedGroup];
    if(selectedGroup.children.length && selectedGroup.children[0].kind === 'Group'){
        selectedGroup.children.forEach((child:any)=>{
            groupsToDelete.push(...walkGroups(child))
        })
    }
    return groupsToDelete;
}

export function setSelectedGroupData(state:IState, action:any){
    return {
        ...state,
        selectedGroupData:action.groupData
    }
}

export function setUsersAfterCreateNewUser(state:IState, action:any){
    return{
        ...state,
        users: state.users.concat([action.newUser]),
        newUser:action.newUser
    }
}

export function setGroupOptionalUsers(state:IState, action:any){
    return{
        ...state,
        groupOptionalUsers:action.groupOptionalUsers
    }
}

export function setGroupsAfterDeleteUserFromGroup(state:IState, action:any){
    const deletedUserId = action.userId;
    const groupId = action.groupId;

    const groupsClone = [...state.groups];
    const group = groupsClone.find((group)=>{
        return group._id === groupId;
    });

    const deletedUserIndex = group.children.findIndex((child:IClientUser)=>{
        return child._id === deletedUserId;
    });
    if(deletedUserIndex !== -1){
        group.children.splice(deletedUserIndex, 1)
    }

    return{
        ...state,
        groups:groupsClone
    }
}

export function setGroupsAfterDeleteGroup(state:IState, action:any){
    const deletedGroup = action.deletedGroup;
    const groupsToDelete = walkGroups(deletedGroup);
    const groupsToDeleteIds = groupsToDelete.map(group => group._id);
    let groupsClone = [...state.groups];
    groupsClone = groupsClone.filter((group)=>{
        return groupsToDeleteIds.indexOf(group._id) === -1;
    });
    const parentGroupId = deletedGroup.parentId;
    const parentGroup = groupsClone.find((group) => group._id === parentGroupId);
    if(parentGroup){
        const deletedGroupIndexInParentChildren = parentGroup.children.findIndex((child:any) => child.childId === deletedGroup._id);
        if(deletedGroupIndexInParentChildren !== -1){
            parentGroup.children.splice(deletedGroupIndexInParentChildren, 1);
        }
    }
    return {
        ...state,
        groups:groupsClone
    }
}

export function setUsersAndGroupsAfterDeleteUser(state:IState, action:any){
    const deletedUser = action.deletedUser;
    const usersClone = [...state.users];
    const groupsClone = [...state.groups];
    const deletedUserIndex = usersClone.findIndex((user)=>{
        return user._id === deletedUser._id;
    });

    if(deletedUserIndex !== -1){
        usersClone.splice(deletedUserIndex, 1);
        groupsClone.forEach((group)=>{
            if(group.children.length && group.children[0].kind === 'User'){
                const deletedUserIndex = group.children.findIndex((child:any)=>{
                    return child._id === deletedUser._id;
                });
                if(deletedUserIndex !== -1){
                   group.children.splice(deletedUserIndex, 1);
                }
            }
        })
    }

    return{
        ...state,
        groups:groupsClone,
        users:usersClone
    }
}