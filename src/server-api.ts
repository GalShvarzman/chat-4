import {IMessage} from "./models/message";
import {request} from './utils/request';
import {IClientGroup, IClientUser} from "./interfaces";

export async function getUsers():Promise<any>{
    return await get('/users');
}

export async function saveUserDetails(user:IClientUser):Promise<{user:IClientUser}>{
    return await patch(`/users/${user._id}`, user);
}

export async function saveGroupDetails(group:any) {
    return await patch(`/groups/${group.id}`, group);
}

export async function deleteUser(user:IClientUser):Promise<void>{
    await remove(`/users/${user["_id"]}`);
}

export async function deleteUserFromGroup(userId:string, groupId:string){
   await remove(`/groups/${groupId}/users/${userId}`)
}

export async function deleteGroup(group:{_id:string, name:string}):Promise<void>{
    await remove(`/groups/${group._id}`);
}

export async function createNewUser(user:IClientUser):Promise<{user:IClientUser}>{
    return await post('/users', user);
}

export async function createNewGroup(group:{name:string, parent:string}) {
    return await post('/groups', group);
}

export async function getGroups():Promise<IClientGroup[]>{
   return await get('/groups');
}

export async function getGroupOptionalUsers(groupId:string){
    return await get(`/groups/${groupId}?optional_users=true`)
}

export async function getGroupData(groupId:string):Promise<any>{
    return await get(`/groups/${groupId}`)
}

export async function getGroupsWithGroupsChildren():Promise<IClientGroup[]>{
    return await get('/groups?groups_with_children=true')
}

export async function addUsersToGroup(data:{usersIds:string[], groupId:string}){
    debugger;
    return await post(`/groups/${data.groupId}/users`, data)
}

export async function getTree(){
    return await get('/groups?tree=true');
}

export async function auth(user:IClientUser){
    return await post(`/users?login=true`, user)
}

export async function getSelectedMessages(selectedId:string){
    return await get(`messages/${selectedId}`)
}

export async function addMessage(message:IMessage, conversationId:string){
    return await post(`messages/${conversationId}`, message);
}

function post(url:string, body:any){
    return request(url,{
        method:'POST',
        body:JSON.stringify(body),
        headers:{'content-type': 'application/json'}
    })
        .then((res)=>{
            return res.json();
        })
}

function patch(url:string, body:any){
    return request(url, {
        method:'PATCH',
        body:JSON.stringify(body),
        headers:{'content-type': 'application/json'}
    })
        .then((res)=>{
            return res.json();
        })
}

function get(url:string){
    return request(url)
        .then((res)=>{
            return (res.json());
        })
}

function remove(url:string){
    return request(url, {
        method:'DELETE'
    })
        .then((result)=>{
            return result;
        })
}