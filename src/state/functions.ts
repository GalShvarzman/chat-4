import {IState} from "./store";
import {IClientGroup} from "../interfaces";

export function setTree(state:IState, action:any){
    return{
        ...state,
        tree:action.tree
    }
}

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

export function updateGroupsAfterEditGroupName(state:IState, action:any){
    const groupsClone = [...state.groups];
    const groupIndex = groupsClone.findIndex((group) => {
        return group._id === action.group._id;
    });
    groupsClone[groupIndex] = action.group;
    return{
        ...state,
        groups : groupsClone,
        updatedGroup:action.group,
        errorMsg:action.errorMsg
    }
}

export function userAfterAuth(state:IState, action:any){
    return {
        ...state,
        loggedInUser:action.loggedInUser,
        loginErrorMsg:action.loginErrorMsg
    }
}

export function afterAuthFailed(state:IState, action:any){
    return{
        ...state,
        loginErrorMsg:action.loginErrorMsg
    }
}

export function setUpdateErrorMsg(state:IState, action:any){
    return{
        ...state,
        errorMsg:action.errorMsg
    }
}

export function updateLoggedInUser(state:IState, action:any){
    return {
        ...state,
        loggedInUser:action.loggedInUser,
        loginErrorMsg:action.loginErrorMsg
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
        groups:groupsClone.concat([newGroup])
    }
}

export function setNewErrorMsg(state:IState, action:any){
    return{
        ...state,
        createNewErrorMsg:action.createNewErrorMsg
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

export function setGroupsAfterDeleteGroup(state:IState, action:any){
    const deletedGroup = action.deletedGroup;
    const groupsToDelete = walkGroups(deletedGroup);
    const groupsToDeleteIds = groupsToDelete.map(group => group._id);
    const groupsClone = [...state.groups];
    const newGroups = groupsClone.filter((group)=>{
        return groupsToDeleteIds.indexOf(group._id) == -1;
    });
    debugger;
    // const deletedGroupIndex = groupsClone.findIndex((group)=>{
    //     return group._id === deletedGroup._id;
    // });
    // if(deletedGroupIndex !== -1){
    //     //groupsClone.splice(deletedGroupIndex, 1);
    //     groupsClone.forEach((group)=>{
    //         if(group.children.length && group.children[0].kind === 'Group'){
    //             const groupIndex = group.children.findIndex((group:any)=>{
    //                 return group._id === deletedGroup._id;
    //             });
    //             if(groupIndex !== -1){
    //                 group.children.splice(groupIndex, 1);
    //             }
    //         }
    //     })
    //}
    return {
        ...state,
        groups:newGroups
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
                    return child.id !== deletedUser._id;
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