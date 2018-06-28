export function request(...args:any[]){
    return fetch(...args)
        .then((res)=>{
            if(res.status >= 200 && res.status <= 299){
                return res;
            }
            else{
                throw new Error("request failed");
            }
    })

}