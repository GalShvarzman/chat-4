import IGroup from './group';

export default interface IUser {
    name:string,
    age:number,
    password:any,
    parents : IGroup[],
    removeParent(parentNode:IGroup): boolean
}

export default class User implements IUser{
    public name:string;
    public age:number;
    public password:any;
    public parents:IGroup[];

    constructor(username:string, age:number, password:any){
        this.name = username;
        this.age = age;
        this.password = password;
        this.parents = [];
    }

    removeParent(parentNode:IGroup){
        let i = this.parents.findIndex((parent)=>{
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

    updateAge(newAge:number){
        this.age = newAge;
        return true;
    }
    updatePassword(newPassword:any){
        this.password = newPassword;
        return true;
    }

    getParentsToPrint(){
        return this.parents.map((parent)=>{
            return parent.name;
        })
    }
}

