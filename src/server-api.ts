export async function getUsers():Promise<any>{
    return await fetch('/users')
        .then((res)=>{
            return res
        })
}