import { Dispatch } from 'redux';
import {addMessage, getSelectedMessages, getTree, auth, deleteUserFromGroup,
    getGroupOptionalUsers, saveGroupDetails, addUsersToGroup, getUsers, saveUserDetails,
    deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup,
    getGroupsWithGroupsChildren} from '../server-api';
import {IClientGroup, IClientUser} from "../interfaces";
import {IMessage} from "../models/message";
import {socket} from "../App";

export function addMessageToConversation(selectedType: string | undefined, selectedId: string | undefined, message: IMessage, loggedInUser: { name: string, id: string } | null) {
    return async (dispatch:Dispatch)=>{
        if (loggedInUser && selectedId) {
            let conversationId;
            if (selectedType === 'group') {
                conversationId = selectedId;
            }
            else {
                conversationId = [selectedId,loggedInUser.id].sort().join("_");
            }
            await addMessage(message, conversationId);
        }
    }
}

export function getSelectedMessagesHistory(selectedId: string) {
    return async (dispatch:Dispatch)=>{
        const messages = await getSelectedMessages(selectedId);
        dispatch(setSelectedMessages(messages));
    }
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
        const groups = await getGroups();
        dispatch(setGroups(groups));
    }
}

export function saveUserNewDetails(user: IClientUser){
    return async (dispatch:Dispatch)=>{
        const updatedUser = await saveUserDetails(user);
        dispatch(updateUsersAfterEditUserDetails(updatedUser));
    }
}


export function saveGroupNewName(group: { name: string, id: string }){
    return async (dispatch:Dispatch)=>{
        try{
            const updatedGroup = await saveGroupDetails(group);
            dispatch(updateGroupsAfterEditGroupName(updatedGroup, "Group updated successfully"));
        }
        catch (e) {
            dispatch(updateGroupNameFailed("Update group name failed"))
        }
    };
}

export function authUser(user: { name: string, password: string }) {
    return async (dispatch:Dispatch)=>{
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

export function logOut(){
    return {
        type:'SET_LOGGED_IN_USER'
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

function updateGroupsAfterEditGroupName(group:IClientGroup, updateErrorMsg:string){
    return {
        type: 'UPDATE_GROUPS_AFTER_EDIT_GROUP_NAME',
        group,
        updateErrorMsg
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

function updateGroupNameFailed(updateErrorMsg:string){
    return{
        type:'UPDATE_FAILED',
        updateErrorMsg
    }
}

function setSelectedMessages(messages:any[]){
    return {
        type:'SET_SELECTED_MESSAGES',
        messages
    }
}

function setUsers(users:IClientUser[]){
    return{
        type: 'SET_USERS',
        users
    }
}

function setGroups(groups:IClientGroup[]){
    return{
        type: 'SET_GROUPS',
        groups
    }
}