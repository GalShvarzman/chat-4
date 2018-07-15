import {IState} from "./store";
import {
    afterAuthFailed,
    setGroupOptionalParents,
    setGroups,
    setGroupsAfterCreateNewGroup,
    setNewErrorMsg,
    setSelectedMessages,
    setTree,
    setUsers,
    setUpdateErrorMsg,
    updateGroupsAfterEditGroupName,
    updateLoggedInUser,
    updateUsersAfterEditUserDetails,
    userAfterAuth,
    setUsersAndGroupsAfterDeleteUser,
    setGroupsAfterDeleteGroup,
    setSelectedGroupData
} from "./functions";

const options = {
    "SET_TREE" : setTree,
    "SET_GROUPS" : setGroups,
    "SET_USERS" : setUsers,
    "SET_SELECTED_MESSAGES" : setSelectedMessages,
    "UPDATE_USERS_AFTER_EDIT_USER_DETAILS" : updateUsersAfterEditUserDetails,
    "UPDATE_GROUPS_AFTER_EDIT_GROUP_NAME" : updateGroupsAfterEditGroupName,
    "USER_AFTER_AUTH" : userAfterAuth,
    "USER_AUTH_FAILED" : afterAuthFailed,
    "SET_ERROR_MSG" : setUpdateErrorMsg,
    "USER_LOGGED_OUT" : updateLoggedInUser,
    "SET_GROUP_OPTIONAL_PARENTS" : setGroupOptionalParents,
    "SET_GROUPS_AFTER_CREATE_NEW_GROUP" : setGroupsAfterCreateNewGroup,
    'SET_NEW_ERROR_MSG' : setNewErrorMsg,
    "SET_USERS_AND_GROUPS_AFTER_DELETE_USER" : setUsersAndGroupsAfterDeleteUser,
    "SET_GROUPS_AFTER_DELETE_GROUP" : setGroupsAfterDeleteGroup,
    "SET_SELECTED_GROUP_DATA" : setSelectedGroupData
};

export function reducer (state:IState, action:any){
    const handler = options[action.type];
    if(handler){
        return handler(state, action);
    }
    return state;
}