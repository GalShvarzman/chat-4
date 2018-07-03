import { Dispatch } from 'redux';
import {addMessage, getSelectedMessages, getTree, auth, deleteUserFromGroup,
    getGroupOptionalUsers, saveGroupDetails, addUsersToGroup, getUsers, saveUserDetails,
    deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup,
    getGroupsWithGroupsChildren} from '../server-api';
import {IClientGroup, IClientUser} from "../interfaces";
import {IMessage} from "../models/message";

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
        dispatch(setUsers(users.data));
    }
}

export function loadGroups():any{
    return async (dispatch:Dispatch) => {
        const groups = await getGroups();
        dispatch(setGroups(groups.data));
    }
}

function setTree(tree:any[]){
    return{
        type: 'SET_TREE',
        tree
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