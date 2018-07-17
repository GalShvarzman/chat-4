import { Dispatch } from 'redux';
import {addMessage, getSelectedMessages, auth, deleteUserFromGroup,
    getGroupOptionalUsers, saveGroupDetails, addUsersToGroup, getUsers, saveUserDetails,
    deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup,
    getGroupsWithGroupsChildren} from '../server-api';
import {IClientGroup, IClientUser} from "../interfaces";
import {IMessage} from "../models/message";
import {socket} from "../App";

export function addMessageToConversation(selectedType: string | undefined, selectedId: string | undefined, message: IMessage, loggedInUser: { name: string, _id: string } | null) {
    return async (dispatch:Dispatch)=>{
        try {
            if (loggedInUser && selectedId) {
                let conversationId;
                if (selectedType === 'Group') {
                    conversationId = selectedId;
                }
                else {
                    conversationId = [selectedId, loggedInUser._id].sort().join("_");
                }
                await addMessage(message, conversationId);
                dispatch({type: ""});
            }
        }
        catch (e) {
            //fixme
        }
    }
}

export function getSelectedMessagesHistory(selectedId: string) {
    return async (dispatch:Dispatch)=>{
        try {
            const result = await getSelectedMessages(selectedId);
            dispatch(setSelectedMessages(result.messages));
        }
        catch(e){
            //fixme
        }
    }
}

export function onCreateNewGroup(group: { name: string, parentId: string }) {
    return async (dispatch:Dispatch) => {
        try {
            const newGroup = await createNewGroup(group);
            dispatch(setGroupsAfterCreateNewGroup(newGroup, group.parentId));
            dispatch(setCreateNewErrorMsg("Group created successfully"));
        }
        catch (e) {
            dispatch(setCreateNewErrorMsg("Create new group failed"));
        }
    };
}

export function loadUsers():any{
    return async (dispatch:Dispatch) => {
        try {
            const users = await getUsers();
            dispatch(setUsers(users));
        }
        catch (e) {
            //fixme
        }
    }
}

export function loadGroups():any{
    return async (dispatch:Dispatch) => {
        try {
            const groups = await getGroups();
            dispatch(setGroups(groups));
        }
        catch (e) {
            //fixme;
        }
    }
}

export function saveUserNewDetails(user: IClientUser){
    return async (dispatch:Dispatch)=>{
        try {
            const updatedUser = await saveUserDetails(user);
            dispatch(updateUsersAfterEditUserDetails(updatedUser));
            dispatch(setErrorMsg("User details update successfully"));
        }
        catch (e) {
            dispatch(setErrorMsg("Update user details failed"));
        }
    }
}

export function onDeleteUser(userToDelete: IClientUser){
    return async (dispatch:Dispatch) => {
        try {
            await deleteUser(userToDelete);
            dispatch(updateUsersAndGroupsAfterDeleteUser(userToDelete));
            dispatch(setErrorMsg("User deleted successfully"));
        }
        catch (e) {
            dispatch(setErrorMsg("Delete user failed"));
        }
    };
}

export function onDeleteGroup(groupToDelete: IClientGroup) {
    return async (dispatch:Dispatch) => {
        try {
            await deleteGroup(groupToDelete);
            dispatch(setGroupsAfterDeleteGroup(groupToDelete));
            dispatch(setErrorMsg(null));
        }
        catch (e) {
            dispatch(setErrorMsg("Delete group failed"));
        }
    }
}

export function getSelectedGroupData(groupId: string) {
    return async (dispatch:Dispatch) => {
        try {
            const groupData = await getGroupData(groupId);
            dispatch(setSelectedGroupData(groupData));
        }
        catch (e) {
            //fixme
        }
    }
}

export function onCreateNewUser(user: IClientUser){
    return async (dispatch:Dispatch) => {
        try {
            const newUser = await createNewUser(user);
            dispatch(setUsersAfterCreateNewUser(newUser));
            dispatch(setNewUserErrorMsg("User created successfully"));
        }
        catch (e) {
            dispatch(setNewUserErrorMsg("Username already exist, choose a different name"));
        }
    };
}


export function saveGroupNewName(group: { name: string, _id: string }){
    return async (dispatch:Dispatch)=>{
        try{
            const updatedGroup = await saveGroupDetails(group);
            dispatch(updateGroupsAfterEditGroup(updatedGroup, null));
        }
        catch (e) {
            dispatch(setErrorMsg("Update group name failed"))
        }
    };
}

export function authUser(user: { name: string, password: string }) {
    return async (dispatch:Dispatch) => {
        try{
            const loggedInUser = await auth(user);
            socket.emit('login', loggedInUser.name);
            dispatch(afterAuthUser(loggedInUser, "You are logged in"));
        }
        catch (e) {
            dispatch(afterAuthUserFailed("Username or password are wrong"));
        }
    }
}

export function getGroupOptionalParents(){
    return async (dispatch:Dispatch) => {
        try {
            const groupOptionalParents = await getGroupsWithGroupsChildren();
            dispatch(setGroupOptionalParents(groupOptionalParents));
        }
        catch (e) {
            //fixme
        }
    }
}

export function onAddUsersToGroup(data: { usersIds: string[], groupId: string }) {
    return async(dispatch:Dispatch) => {
        try {
            const updatedGroup = await addUsersToGroup(data);
            dispatch(updateGroupsAfterEditGroup(updatedGroup, "Users added successfully to group"));
        }
        catch (e) {
            dispatch(setErrorMsg("Add users to group failed"));
        }
    }
}

export function onGetGroupOptionalUsers(groupId: string) {
    return async (dispatch:Dispatch) => {
        try {
            const groupOptionalUsers = await getGroupOptionalUsers(groupId);
            dispatch(setGroupOptionalUsers(groupOptionalUsers));
        }
        catch (e) {
            dispatch(setAddUsersToGroupErrorMsg("Fetch optional users failed"));
        }
    };
}

export function onDeleteUserFromGroup(userId: string, groupId: string):any {
    return async (dispatch:Dispatch) => {
        try {
            await deleteUserFromGroup(userId, groupId);
            dispatch(setGroupsAfterDeleteUserFromGroup(userId, groupId));
            dispatch(setErrorMsg("User deleted successfully from group"));
        }
        catch (e) {
            dispatch(setErrorMsg("Delete user from group failed"));
        }
    }
}

export function logOut(loggedInUser:null, loginErrorMsg:null){
    return {
        type:'USER_LOGGED_OUT',
        loggedInUser,
        loginErrorMsg
    }
}

function updateUsersAfterEditUserDetails(user:any){
    return {
        type: 'UPDATE_USERS_AFTER_EDIT_USER_DETAILS',
        user
    }
}

function updateGroupsAfterEditGroup(group:IClientGroup, errorMsg:null|string){
    return {
        type: 'UPDATE_GROUPS_AFTER_EDIT_GROUP',
        group,
        errorMsg
    }
}

function setUsersAfterCreateNewUser(newUser:any){
    return {
        type:'SET_USERS_AFTER_CREATE_NEW_USER',
        newUser
    }
}

function afterAuthUser(loggedInUser:IClientUser, loginErrorMsg:string){
    return {
        type: 'USER_AFTER_AUTH',
        loggedInUser,
        loginErrorMsg
    }
}

function afterAuthUserFailed(loginErrorMsg:string){
    return {
        type: 'USER_AUTH_FAILED',
        loginErrorMsg
    }
}

function setGroupOptionalParents(groupOptionalParents:IClientGroup[]){
    return {
        type: 'SET_GROUP_OPTIONAL_PARENTS',
        groupOptionalParents
    }
}

function setGroupOptionalUsers(groupOptionalUsers:any[]){
    return{
        type:'SET_GROUP_OPTIONAL_USERS',
        groupOptionalUsers
    }
}

export function setAddUsersToGroupErrorMsg(addUsersToGroupErrorMsg:string|null){
    return{
     type:'SET_ADD_USERS_TO_GROUP_ERROR_MSG',
     addUsersToGroupErrorMsg
    }
}

export function setErrorMsg(errorMsg:string){
    return{
        type:'SET_ERROR_MSG',
        errorMsg
    }
}

function setGroupsAfterDeleteUserFromGroup(userId:string, groupId:string){
    return{
        type:'SET_GROUPS_AFTER_DELETE_USER_FROM_GROUP',
        userId,
        groupId
    }
}

export function setNewUserErrorMsg(newUserErrorMsg:string|null){
    return{
        type:'SET_NEW_USER_ERROR_MSG',
        newUserErrorMsg
    }
}

function setSelectedGroupData(groupData:{}){
    return {
        type:'SET_SELECTED_GROUP_DATA',
        groupData
    }
}

function setGroupsAfterDeleteGroup(deletedGroup:IClientGroup){
    return {
        type:'SET_GROUPS_AFTER_DELETE_GROUP',
        deletedGroup
    }
}

function updateUsersAndGroupsAfterDeleteUser(deletedUser:IClientUser){
    return {
        type:'SET_USERS_AND_GROUPS_AFTER_DELETE_USER',
        deletedUser
    }
}

function setSelectedMessages(messages:any[]){
    return {
        type:'SET_SELECTED_MESSAGES',
        messages
    }
}

function setGroupsAfterCreateNewGroup(newGroup:IClientGroup, parent:any){
    return {
        type:'SET_GROUPS_AFTER_CREATE_NEW_GROUP',
        newGroup,
        parent
    }
}

export function setCreateNewErrorMsg(createNewErrorMsg:string){
    return {
        type:'SET_NEW_ERROR_MSG',
        createNewErrorMsg
    }
}

function setUsers(users:IClientUser[]){
    return {
        type: 'SET_USERS',
        users
    }
}

function setGroups(groups:IClientGroup[]){
    return {
        type: 'SET_GROUPS',
        groups
    }
}