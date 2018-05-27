import IGroup from './group';

export default interface IUser {
    name:string,
    age:number,
    password:string,
    parents : IGroup[],
    removeParent(parentNode:IGroup): boolean
}

export default class User implements IUser{
    public name:string;
    public age:number;
    public password:string;
    public parents:IGroup[];

    constructor(username:string, age:number, password:any){
        this.name = username;
        this.age = age;
        this.password = password;
        this.parents = [];
    }

    public removeParent(parentNode:IGroup){
        const i = this.parents.findIndex((parent)=>{
                    return parent  === parentNode
                });
        if(i !== -1){
            this.parents.splice(i, 1);
            return true
        }
        else{
            return false;
        }
    }

    public updateAge(newAge:number){
        this.age = newAge;
        return true;
    }
    public updatePassword(newPassword:any){
        this.password = newPassword;
        return true;
    }

    public getParentsToPrint(){
        return this.parents.map((parent)=>{
            return parent.name;
        })
    }
}

