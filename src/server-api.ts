export function getUsers():Promise<any>{
    return get('/users');
}

export function saveUserDetails(user:{name:string, age?:number, password:string, id:string}):Promise<any>{
    return put(`/users/${user.id}/edit`, user);
}

export function deleteUser(user:{name:string, age:number, id:string}):Promise<boolean>{
    return remove(`/users/${user.id}`);
}

export function createNewUser(user:{name:string, age:number, password:string}):Promise<{user:{name:string, age:string, id:string}}>{
    return post('/users', user);
}

export function getGroups():Promise<any>{
   return get('/groups');
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

function put(url:string, body:any){
    return fetch(url, {
        method:'PUT',
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
        .then((res)=>{
            return res.json();
        })
}
