import IGroup from './group';
import {IMessage} from '../components/chat';

export default interface IUser {
    name:string,
    age?:number,
    password:string,
    parents : IGroup[],
    messages : {},
    type:string;
    removeParent(parentNode:IGroup):boolean,
    auth(enteredPassword:string):boolean,
    addMessage(massage:{}, chatWith:string|null):{user:IUser, chatWith:string}|void,
    getMessages(loggedInUserName:string|null|undefined):IMessage[]
}

export default class User implements IUser{
    public name:string;
    public age?:number;
    public password:string;
    public parents:IGroup[];
    public messages:{};
    public type:string;

    constructor(username:string, age:number, password:string){
        this.name = username;
        this.age = age;
        this.password = password;
        this.parents = [];
        this.messages = {};
        this.type = 'user';
    }

    public addMessage(massage:string, chatWith:string){
        if(this.messages[chatWith]){
            this.messages[chatWith].push(massage);
            return;
        }
        this.messages[chatWith] = [massage];
        return ({user:this, chatWith});
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
    public updatePassword(newPassword:any){
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

    public getMessages(loggedInUserName:string|null){
        if(loggedInUserName && this.messages[loggedInUserName]) {
            return this.messages[loggedInUserName]
        }
        else{
            return [];
        }
    }
}

