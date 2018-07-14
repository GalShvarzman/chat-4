import {IState} from "./store";

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
    const users = state.users;
    const usersClone = [...users];
    const userIndex = usersClone.findIndex((user) => {
        return user._id === action.user.user._id;
    });
    usersClone[userIndex] = action.user.user;
    return{
        ...state,
        users : usersClone
    }
}

export function updateGroupsAfterEditGroupName(state:IState, action:any){
    const groups = state.groups;
    const groupsClone = [...groups];
    const groupIndex = groupsClone.findIndex((group) => {
        return group._id === action.group.group._id;
    });
    groupsClone[groupIndex] = action.group.group;
    return{
        ...state,
        groups : groupsClone,
        updatedGroup:action.group,
        updateErrorMsg:action.updateErrorMsg
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

export function updateDetailsFailed(state:IState, action:any){
    return{
        ...state,
        updateErrorMsg:action.updateErrorMsg
    }
}

export function updateLoggedInUser(state:IState, action:any){
    return {
        ...state,
        loggedInUser:action.loggedInUser,
        loginErrorMsg:action.loginErrorMsg
    }
}