import IGroup from './group';
import * as uuidv4 from 'uuid/v4';

export default interface IUser {
    id:string,
    name:string,
    age?:number,
    password:string,
    parents : IGroup[],
    type:string;
    removeParent(parentNode:IGroup):boolean,
    auth(enteredPassword:string):boolean
    updateAge(newAge:number):boolean,
    updatePassword(newPassword:string):boolean
}

export default class User implements IUser{
    public name:string;
    public age?:number;
    public password:string;
    public parents:IGroup[];
    public type:string;
    public id:string;

    constructor(username:string, age:number, password:string){
        this.name = username;
        this.age = age;
        this.password = password;
        this.parents = [];
        this.type = 'user';
        this.id = uuidv4();
    }

    public removeParent(parentNode:IGroup){
        if(this.parents.length){
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
        return false;
    }

    public updateAge(newAge:number){
        this.age = newAge;
        return true;
    }
    public updatePassword(newPassword:string){
        this.password = newPassword;
        return true;
    }

    public getParentsToPrint(){
        if(this.parents.length){
            return this.parents.map((parent)=>{
                return parent.name;
            })
        }
        return false;
    }

    public auth(enteredPassword:string){
        return enteredPassword === this.password
    }
}

