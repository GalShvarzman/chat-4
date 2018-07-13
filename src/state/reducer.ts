import {IState} from "./store";
import {afterAuthFailed, setGroups, setSelectedMessages, setTree, setUsers, updateDetailsFailed,
    updateGroupsAfterEditGroupName, updateLoggedInUser, updateUsersAfterEditUserDetails, userAfterAuth
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
    "UPDATE_FAILED" : updateDetailsFailed,
    "USER_LOGGED_OUT" : updateLoggedInUser
};

export function reducer (state:IState, action:any){
    const handler = options[action.type];
    if(handler){
        return handler(state, action);
    }
    return state;
}