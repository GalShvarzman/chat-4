export function getUsers():Promise<any>{
    return fetch('/users')
        .then((res)=>{
            return (res.json());
        })
}