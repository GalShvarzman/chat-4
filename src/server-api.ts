import IUser from './models/user';

export function getUsers():Promise<any>{
    return fetch('/users')
        .then((res)=>{
            return (res.json());
        })
}

export function saveUserDetails(user:IUser):Promise<any>{
    return fetch(`/users/${user.id}/edit`, {
        method:'PUT',
        body:JSON.stringify(user),
        headers:{'content-type': 'application/json'}
    })
    .then((res)=>{
        return res.json();
    })
}

export function deleteUser(user:{name:string, age:number, id:string}):Promise<boolean>{
    return fetch(`/users/${user.id}`, {
        method:'DELETE',
        body:JSON.stringify(user),
        headers:{'content-type': 'application/json'}
    })
    .then((res)=>{
        return res.json();
    })
}

export function createNewUser(user:{name:string, age:number, password:string}):Promise<{user:{name:string, age:string, id:string}}>{
    return fetch('/users',{
        method:'POST',
        body:JSON.stringify(user),
        headers:{'content-type': 'application/json'}
    })
        .then((res)=>{
            return res.json();
        })
}