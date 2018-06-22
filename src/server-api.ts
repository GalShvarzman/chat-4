export function getUsers():Promise<any>{
    return get('/users');
}

export function saveUserDetails(user:{name:string, age?:number, password?:string, id:string}):Promise<any>{
    return patch(`/users/${user.id}`, user);
}

export function deleteUser(user:{name:string, age:number, id:string}):Promise<void>{
    return remove(`/users/${user.id}`);
}

export function deleteGroup(group:{id:string, name:string}):Promise<void>{
    return remove(`groups/${group.id}`);
}

export function createNewUser(user:{name:string, age?:number, password:string}):Promise<{user:{name:string, age:string, id:string}}>{
    return post('/users', user);
}

export function createNewGroup(group:{name:string, parent:string}) {
    return post('/groups', group);
}

export function getGroups():Promise<any>{
   return get('/groups');
}

export function getGroupData(groupId:string):Promise<any>{
    return get(`/groups/${groupId}`)
}

function post(url:string, body:any){
    return fetch(url,{
        method:'POST',
        body:JSON.stringify(body),
        headers:{'content-type': 'application/json'}
    })
        .then((res)=>{
            return res.json();
        })
}

function patch(url:string, body:any){
    return fetch(url, {
        method:'PATCH',
        body:JSON.stringify(body),
        headers:{'content-type': 'application/json'}
    })
        .then((res)=>{
            return res.json();
        })
}

function get(url:string){
    return fetch(url)
        .then((res)=>{
            return (res.json());
        })
}

function remove(url:string){
    return fetch(url, {
        method:'DELETE'
    })
        .then(()=>{
            return;
        })
}
