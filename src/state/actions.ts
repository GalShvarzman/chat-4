import { Dispatch } from 'redux';
import {addMessage, getSelectedMessages, getTree, auth, deleteUserFromGroup,
    getGroupOptionalUsers, saveGroupDetails, addUsersToGroup, getUsers, saveUserDetails,
    deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup,
    getGroupsWithGroupsChildren} from '../server-api';
import {IClientGroup, IClientUser} from "../interfaces";
import {IMessage} from "../models/message";
import {socket} from "../App";

export function addMessageToConversation(selectedType: string | undefined, selectedId: string | undefined, message: IMessage, loggedInUser: { name: string, _id: string } | null) {
    return async (dispatch:Dispatch)=>{
        if (loggedInUser && selectedId) {
            let conversationId;
            if (selectedType === 'Group') {
                conversationId = selectedId;
            }
            else {
                conversationId = [selectedId,loggedInUser._id].sort().join("_");
            }
            await addMessage(message, conversationId);
            dispatch({type:""});
        }
    }
}

export function getSelectedMessagesHistory(selectedId: string) {
    return async (dispatch:Dispatch)=>{
        const result = await getSelectedMessages(selectedId);
        dispatch(setSelectedMessages(result.messages));
    }
}

export function onCreateNewGroup(group: { name: string, parentId: string }) {
    return async (dispatch:Dispatch) => {
        try {
            const newGroup = await createNewGroup(group);
            dispatch(setGroupsAfterCreateNewGroup(newGroup, group.parentId));
            dispatch(setNewErrorMsg("Group created successfully"));
        }
        catch (e) {
            dispatch(setNewErrorMsg("Create new group failed"));
        }
    };
}


export function loadTree():any{
    return async (dispatch:Dispatch) => {
        const tree = await getTree();
        dispatch(setTree(tree));
    }
}

export function loadUsers():any{
    return async (dispatch:Dispatch) => {
        const users = await getUsers();
        dispatch(setUsers(users));
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


export function saveGroupNewName(group: { name: string, _id: string }){
    return async (dispatch:Dispatch)=>{
        try{
            const updatedGroup = await saveGroupDetails(group);
            dispatch(updateGroupsAfterEditGroupName(updatedGroup, null));
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

export function logOut(loggedInUser:null, loginErrorMsg:null){
    return {
        type:'USER_LOGGED_OUT',
        loggedInUser,
        loginErrorMsg
    }
}

function setTree(tree:any[]){
    return{
        type: 'SET_TREE',
        tree
    }
}

function updateUsersAfterEditUserDetails(user:any){
    return {
        type: 'UPDATE_USERS_AFTER_EDIT_USER_DETAILS',
        user
    }
}

function updateGroupsAfterEditGroupName(group:IClientGroup, errorMsg:null){
    return {
        type: 'UPDATE_GROUPS_AFTER_EDIT_GROUP_NAME',
        group,
        errorMsg
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

function setErrorMsg(errorMsg:string){
    return{
        type:'SET_ERROR_MSG',
        errorMsg
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

function setNewErrorMsg(createNewErrorMsg:string){
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