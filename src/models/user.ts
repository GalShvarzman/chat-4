import IGroup from './group';

function create_UUID(){
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
export default interface IUser {
    id:string,
    name:string,
    age?:number,
    password:string,
    parents : IGroup[],
    messages : {},
    type:string;
    removeParent(parentNode:IGroup):boolean,
    auth(enteredPassword:string):boolean,
    // addMessage(massage:{}, chatWith:string|null):{user:IUser, chatWith:string}|void,
    // getMessages(loggedInUserName:string|null|undefined):IMessage[]
}

export default class User implements IUser{
    public name:string;
    public age?:number;
    public password:string;
    public parents:IGroup[];
    public messages:{};
    public type:string;
    public id:string;

    constructor(username:string, age:number, password:string){
        if(username == 'Roni'){debugger}
        this.name = username;
        this.age = age;
        this.password = password;
        this.parents = [];
        this.messages = {};
        this.type = 'user';
        this.id = create_UUID();
    }

    // public addMessage(massage:string, chatWith:string){
    //     if(this.messages[chatWith]){
    //         this.messages[chatWith].push(massage);
    //         return;
    //     }
    //     this.messages[chatWith] = [massage];
    // }

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

    // public getMessages(loggedInUserName:string|null){debugger
    //     if(loggedInUserName && this.messages[loggedInUserName]) {
    //         return this.messages[loggedInUserName]
    //     }
    //     // else if(loggedInUserName){
    //     //     return (this.messages[loggedInUserName] = []);
    //     // }
    // }
}

