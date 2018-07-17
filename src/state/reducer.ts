import {IState} from "./store";
import {
    afterAuthFailed,
    setGroupOptionalParents,
    setGroups,
    setGroupsAfterCreateNewGroup,
    setNewErrorMsg,
    setSelectedMessages,
    setUsers,
    setUpdateErrorMsg,
    updateGroupsAfterEditGroup,
    updateLoggedInUser,
    updateUsersAfterEditUserDetails,
    userAfterAuth,
    setUsersAndGroupsAfterDeleteUser,
    setGroupsAfterDeleteGroup,
    setSelectedGroupData,
    setUsersAfterCreateNewUser,
    setNewUserErrorMsg,
    setGroupOptionalUsers,
    setAddUsersToGroupErrorMsg, setGroupsAfterDeleteUserFromGroup
} from "./functions";

const options = {
    "SET_GROUPS" : setGroups,
    "SET_USERS" : setUsers,
    "SET_SELECTED_MESSAGES" : setSelectedMessages,
    "UPDATE_USERS_AFTER_EDIT_USER_DETAILS" : updateUsersAfterEditUserDetails,
    "UPDATE_GROUPS_AFTER_EDIT_GROUP" : updateGroupsAfterEditGroup,
    "USER_AFTER_AUTH" : userAfterAuth,
    "USER_AUTH_FAILED" : afterAuthFailed,
    "SET_ERROR_MSG" : setUpdateErrorMsg,
    "USER_LOGGED_OUT" : updateLoggedInUser,
    "SET_GROUP_OPTIONAL_PARENTS" : setGroupOptionalParents,
    "SET_GROUPS_AFTER_CREATE_NEW_GROUP" : setGroupsAfterCreateNewGroup,
    'SET_NEW_ERROR_MSG' : setNewErrorMsg,
    "SET_USERS_AND_GROUPS_AFTER_DELETE_USER" : setUsersAndGroupsAfterDeleteUser,
    "SET_GROUPS_AFTER_DELETE_GROUP" : setGroupsAfterDeleteGroup,
    "SET_SELECTED_GROUP_DATA" : setSelectedGroupData,
    "SET_USERS_AFTER_CREATE_NEW_USER" : setUsersAfterCreateNewUser,
    "SET_NEW_USER_ERROR_MSG" : setNewUserErrorMsg,
    "SET_GROUP_OPTIONAL_USERS" : setGroupOptionalUsers,
    "SET_ADD_USERS_TO_GROUP_ERROR_MSG" : setAddUsersToGroupErrorMsg,
    "SET_GROUPS_AFTER_DELETE_USER_FROM_GROUP" : setGroupsAfterDeleteUserFromGroup
};

export function reducer (state:IState, action:any){
    const handler = options[action.type];
    if(handler){
        return handler(state, action);
    }
    return state;
}