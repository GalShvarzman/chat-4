import {IState} from "./store";
import {
    setGroupOptionalParents,
    setGroups,
    setGroupsAfterCreateNewGroup,
    setSelectedMessages,
    setUsers,
    setUpdateErrorMsg,
    updateGroupsAfterEditGroup,
    setLoggedInUser,
    updateUsersAfterEditUserDetails,
    setUsersAndGroupsAfterDeleteUser,
    setGroupsAfterDeleteGroup,
    setSelectedGroupData,
    setUsersAfterCreateNewUser,
    setGroupOptionalUsers, setGroupsAfterDeleteUserFromGroup
} from "./functions";

const options = {
    "SET_GROUPS" : setGroups,
    "SET_USERS" : setUsers,
    "SET_SELECTED_MESSAGES" : setSelectedMessages,
    "UPDATE_USERS_AFTER_EDIT_USER_DETAILS" : updateUsersAfterEditUserDetails,
    "UPDATE_GROUPS_AFTER_EDIT_GROUP" : updateGroupsAfterEditGroup,
    "SET_LOGGED_IN_USER" : setLoggedInUser,
    "SET_ERROR_MSG" : setUpdateErrorMsg,
    "SET_GROUP_OPTIONAL_PARENTS" : setGroupOptionalParents,
    "SET_GROUPS_AFTER_CREATE_NEW_GROUP" : setGroupsAfterCreateNewGroup,
    "SET_USERS_AND_GROUPS_AFTER_DELETE_USER" : setUsersAndGroupsAfterDeleteUser,
    "SET_GROUPS_AFTER_DELETE_GROUP" : setGroupsAfterDeleteGroup,
    "SET_SELECTED_GROUP_DATA" : setSelectedGroupData,
    "SET_USERS_AFTER_CREATE_NEW_USER" : setUsersAfterCreateNewUser,
    "SET_GROUP_OPTIONAL_USERS" : setGroupOptionalUsers,
    "SET_GROUPS_AFTER_DELETE_USER_FROM_GROUP" : setGroupsAfterDeleteUserFromGroup
};

export function reducer (state:IState, action:any){
    const handler = options[action.type];
    if(handler){
        return handler(state, action);
    }
    return state;
}