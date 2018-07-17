import { Dispatch } from 'redux';
import {addMessage, getSelectedMessages, auth, deleteUserFromGroup,
    getGroupOptionalUsers, saveGroupDetails, addUsersToGroup, getUsers, saveUserDetails,
    deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup,
    getGroupsWithGroupsChildren} from '../server-api';
import {IClientGroup, IClientUser} from "../interfaces";
import {IMessage} from "../models/message";
import {socket} from "../App";

export function addMessageToConversation(selectedType: string | undefined, selectedId: string | undefined, message: IMessage, loggedInUser: IClientUser | null) {
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
            }
        }
        catch (e) {
            dispatch(setErrorMsg("Failed to save the message"));
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
            dispatch(setErrorMsg("Fetch messages history failed"));
        }
    }
}

export function onCreateNewGroup(group: IClientGroup) {
    return async (dispatch:Dispatch) => {
        try {
            const newGroup = await createNewGroup(group);
            dispatch(setGroupsAfterCreateNewGroup(newGroup, group.parentId));
            dispatch(setErrorMsg("Group created successfully"));
        }
        catch (e) {
            dispatch(setErrorMsg("Create new group failed"));
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
            dispatch(setErrorMsg("Fetch users failed"));
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
            dispatch(setErrorMsg("Fetch groups failed"));
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
            dispatch(setErrorMsg("Fetch group data failed"));
        }
    }
}

export function onCreateNewUser(user: IClientUser, signUp?:boolean){
    return async (dispatch:Dispatch) => {
        try {
            const newUser = await createNewUser(user);
            dispatch(setUsersAfterCreateNewUser(newUser));
            dispatch(setErrorMsg("User created successfully"));
            if(signUp){
                socket.emit('login', newUser["name"]);
                dispatch(setLoggedInUser(newUser));
            }
        }
        catch (e) {
            dispatch(setErrorMsg("Username already exist, choose a different name"));
        }
    };
}


export function saveGroupNewName(group: IClientGroup){
    return async (dispatch:Dispatch)=>{
        try{
            const updatedGroup = await saveGroupDetails(group);
            dispatch(updateGroupsAfterEditGroup(updatedGroup));
            dispatch(setErrorMsg("Group name updated successfully"));
        }
        catch (e) {
            dispatch(setErrorMsg("Update group name failed"));
        }
    };
}

export function authUser(user: { name: string, password: string }) {
    return async (dispatch:Dispatch) => {
        try{
            const loggedInUser = await auth(user);
            socket.emit('login', loggedInUser.name);
            dispatch(setLoggedInUser(loggedInUser));
        }
        catch (e) {
            dispatch(setErrorMsg("Username or password are wrong"));
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
            dispatch(setErrorMsg("Fetch group optional parents failed"));
        }
    }
}

export function onAddUsersToGroup(data: { usersIds: string[], groupId: string }) {
    return async(dispatch:Dispatch) => {
        try {
            const updatedGroup = await addUsersToGroup(data);
            dispatch(updateGroupsAfterEditGroup(updatedGroup));
            dispatch(setErrorMsg("Users added successfully to group"));
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
            dispatch(setErrorMsg("Fetch optional users failed"));
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

function updateUsersAfterEditUserDetails(user:any){
    return {
        type: 'UPDATE_USERS_AFTER_EDIT_USER_DETAILS',
        user
    }
}

function updateGroupsAfterEditGroup(group:IClientGroup){
    return {
        type: 'UPDATE_GROUPS_AFTER_EDIT_GROUP',
        group
    }
}

function setUsersAfterCreateNewUser(newUser:any){
    return {
        type:'SET_USERS_AFTER_CREATE_NEW_USER',
        newUser
    }
}

export function setLoggedInUser(loggedInUser:any){
    return {
        type: 'SET_LOGGED_IN_USER',
        loggedInUser
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

export function setSelectedMessages(messages:any[]){
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